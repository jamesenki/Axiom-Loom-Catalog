/**
 * Analytics API
 * 
 * Provides endpoints for analytics data collection and retrieval
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { getAnalyticsQueue } = require('../middleware/analytics.middleware');

// In-memory analytics storage (in production, use a database)
const analyticsStore = {
  events: [],
  pageViews: [],
  errors: [],
  performance: []
};

// Clean up old data periodically
setInterval(() => {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  
  // Keep only last 24 hours of data
  analyticsStore.events = analyticsStore.events.filter(e => 
    new Date(e.timestamp).getTime() > oneDayAgo
  );
  analyticsStore.pageViews = analyticsStore.pageViews.filter(e => 
    new Date(e.timestamp).getTime() > oneDayAgo
  );
  analyticsStore.errors = analyticsStore.errors.filter(e => 
    new Date(e.timestamp).getTime() > oneDayAgo
  );
  analyticsStore.performance = analyticsStore.performance.filter(e => 
    new Date(e.timestamp).getTime() > oneDayAgo
  );
}, 60 * 60 * 1000); // Every hour

// Collect analytics events from frontend
router.post('/collect', async (req, res) => {
  try {
    const { events, metadata } = req.body;
    
    if (!Array.isArray(events)) {
      return res.status(400).json({ error: 'Events must be an array' });
    }

    // Process and store events
    events.forEach(event => {
      const enrichedEvent = {
        ...event,
        serverTimestamp: new Date().toISOString(),
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        userId: req.user?.id
      };

      // Categorize events
      if (event.eventCategory === 'pageview' || event.eventName === 'page_view') {
        analyticsStore.pageViews.push(enrichedEvent);
      } else if (event.eventCategory === 'error') {
        analyticsStore.errors.push(enrichedEvent);
      } else if (event.eventCategory === 'performance') {
        analyticsStore.performance.push(enrichedEvent);
      } else {
        analyticsStore.events.push(enrichedEvent);
      }
    });

    res.json({ 
      success: true, 
      received: events.length 
    });
  } catch (error) {
    console.error('Error collecting analytics:', error);
    res.status(500).json({ error: 'Failed to collect analytics' });
  }
});

// Get analytics summary (admin only)
router.get('/summary', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    // Calculate time range
    const now = Date.now();
    let startTime;
    switch (timeRange) {
      case '1h':
        startTime = now - 60 * 60 * 1000;
        break;
      case '24h':
        startTime = now - 24 * 60 * 60 * 1000;
        break;
      case '7d':
        startTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case '30d':
        startTime = now - 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        startTime = now - 24 * 60 * 60 * 1000;
    }

    // Filter events by time range
    const filterByTime = (events) => events.filter(e => 
      new Date(e.timestamp || e.serverTimestamp).getTime() > startTime
    );

    const pageViews = filterByTime(analyticsStore.pageViews);
    const events = filterByTime(analyticsStore.events);
    const errors = filterByTime(analyticsStore.errors);

    // Calculate metrics
    const summary = {
      timeRange,
      totalPageViews: pageViews.length,
      uniqueVisitors: new Set(pageViews.map(e => e.userId || e.sessionId)).size,
      totalEvents: events.length,
      totalErrors: errors.length,
      topPages: getTopItems(pageViews, 'path', 10),
      topEvents: getTopItems(events, 'eventName', 10),
      eventsByCategory: groupByProperty(events, 'eventCategory'),
      errorsByType: groupByProperty(errors, 'type'),
      hourlyPageViews: getHourlyStats(pageViews),
      averageSessionDuration: calculateAverageSessionDuration(pageViews),
      bounceRate: calculateBounceRate(pageViews)
    };

    res.json(summary);
  } catch (error) {
    console.error('Error generating analytics summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Get detailed analytics data (admin only)
router.get('/data/:type', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { type } = req.params;
    const { limit = 100, offset = 0, timeRange = '24h' } = req.query;
    
    // Validate type
    if (!['events', 'pageViews', 'errors', 'performance'].includes(type)) {
      return res.status(400).json({ error: 'Invalid data type' });
    }

    // Get data
    const data = analyticsStore[type] || [];
    
    // Apply filters and pagination
    const filteredData = data
      .sort((a, b) => new Date(b.timestamp || b.serverTimestamp) - new Date(a.timestamp || a.serverTimestamp))
      .slice(Number(offset), Number(offset) + Number(limit));

    res.json({
      type,
      total: data.length,
      limit: Number(limit),
      offset: Number(offset),
      data: filteredData
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Get real-time analytics (admin only)
router.get('/realtime', authenticate, authorize('admin'), async (req, res) => {
  try {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    
    // Get recent events
    const recentEvents = analyticsStore.events
      .filter(e => new Date(e.timestamp || e.serverTimestamp).getTime() > fiveMinutesAgo);
    
    const recentPageViews = analyticsStore.pageViews
      .filter(e => new Date(e.timestamp || e.serverTimestamp).getTime() > fiveMinutesAgo);

    // Get backend analytics queue
    const backendQueue = getAnalyticsQueue();

    res.json({
      timestamp: new Date().toISOString(),
      activeUsers: new Set(recentPageViews.map(e => e.userId || e.sessionId)).size,
      recentEvents: recentEvents.slice(-20),
      recentPageViews: recentPageViews.slice(-20),
      eventsPerMinute: Math.round(recentEvents.length / 5),
      pageViewsPerMinute: Math.round(recentPageViews.length / 5),
      backendQueueSize: backendQueue.length
    });
  } catch (error) {
    console.error('Error fetching real-time analytics:', error);
    res.status(500).json({ error: 'Failed to fetch real-time data' });
  }
});

// Export analytics data (admin only)
router.get('/export', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { format = 'json', type = 'all', timeRange = '24h' } = req.query;
    
    // Prepare data for export
    const exportData = {
      exportDate: new Date().toISOString(),
      timeRange,
      events: type === 'all' || type === 'events' ? analyticsStore.events : [],
      pageViews: type === 'all' || type === 'pageViews' ? analyticsStore.pageViews : [],
      errors: type === 'all' || type === 'errors' ? analyticsStore.errors : [],
      performance: type === 'all' || type === 'performance' ? analyticsStore.performance : []
    };

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(exportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-export-${Date.now()}.csv`);
      res.send(csv);
    } else {
      // Default to JSON
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-export-${Date.now()}.json`);
      res.json(exportData);
    }
  } catch (error) {
    console.error('Error exporting analytics:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Helper functions
function getTopItems(items, property, limit) {
  const counts = {};
  items.forEach(item => {
    const value = item[property];
    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });
  
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

function groupByProperty(items, property) {
  const groups = {};
  items.forEach(item => {
    const value = item[property] || 'unknown';
    groups[value] = (groups[value] || 0) + 1;
  });
  return groups;
}

function getHourlyStats(items) {
  const hourly = Array(24).fill(0);
  items.forEach(item => {
    const hour = new Date(item.timestamp || item.serverTimestamp).getHours();
    hourly[hour]++;
  });
  return hourly.map((count, hour) => ({ hour, count }));
}

function calculateAverageSessionDuration(pageViews) {
  // Group by session
  const sessions = {};
  pageViews.forEach(pv => {
    const sessionId = pv.sessionId || pv.userId || 'anonymous';
    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }
    sessions[sessionId].push(new Date(pv.timestamp || pv.serverTimestamp).getTime());
  });

  // Calculate durations
  const durations = Object.values(sessions).map(times => {
    if (times.length < 2) return 0;
    times.sort((a, b) => a - b);
    return times[times.length - 1] - times[0];
  });

  if (durations.length === 0) return 0;
  const average = durations.reduce((sum, d) => sum + d, 0) / durations.length;
  return Math.round(average / 1000); // Convert to seconds
}

function calculateBounceRate(pageViews) {
  // Group by session
  const sessions = {};
  pageViews.forEach(pv => {
    const sessionId = pv.sessionId || pv.userId || 'anonymous';
    sessions[sessionId] = (sessions[sessionId] || 0) + 1;
  });

  // Calculate bounce rate (sessions with only 1 page view)
  const totalSessions = Object.keys(sessions).length;
  const bouncedSessions = Object.values(sessions).filter(count => count === 1).length;
  
  if (totalSessions === 0) return 0;
  return Math.round((bouncedSessions / totalSessions) * 100);
}

function convertToCSV(data) {
  // Simple CSV conversion for events
  const events = [...data.events, ...data.pageViews, ...data.errors];
  if (events.length === 0) return 'No data to export';

  const headers = Object.keys(events[0]);
  const csv = [
    headers.join(','),
    ...events.map(event => 
      headers.map(header => JSON.stringify(event[header] || '')).join(',')
    )
  ].join('\n');

  return csv;
}

module.exports = router;
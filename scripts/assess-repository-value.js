#!/usr/bin/env node

/**
 * Repository Value Assessment Script
 * Analyzes each repository and assigns a suggested retail price
 * based on comprehensive value criteria
 */

const fs = require('fs');
const path = require('path');

// Load repositories
async function loadRepositories() {
  try {
    const response = await fetch('http://localhost:3000/api/repositories');
    return await response.json();
  } catch (error) {
    // Fallback to local file if API not available
    const repoPath = path.join(__dirname, '../cache/repositories/metadata.json');
    if (fs.existsSync(repoPath)) {
      return JSON.parse(fs.readFileSync(repoPath, 'utf8'));
    }
    throw new Error('Could not load repositories');
  }
}

// Value assessment function
function assessRepositoryValue(repo) {
  const scores = {
    domainValue: 0,
    technicalCompleteness: 0,
    implementationReadiness: 0,
    businessValue: 0,
    ecosystem: 0
  };
  
  // 1. Domain & Market Value Assessment
  const assessDomainValue = () => {
    let score = 50; // Base score
    
    // Category bonuses
    const categoryScores = {
      'AI/ML': 20,
      'Architecture': 15,
      'Platform': 15,
      'Security': 20,
      'Payment': 25,
      'Integration': 10,
      'Infrastructure': 15,
      'API': 10,
      'Mobile': 10,
      'Developer Tools': 5
    };
    
    score += categoryScores[repo.category] || 0;
    
    // Tag bonuses
    const valuableTags = ['Enterprise', 'Security', 'Compliance', 'Real-time', 'IoT', 'Blockchain', 'Cloud', 'Microservices'];
    repo.tags?.forEach(tag => {
      if (valuableTags.some(vt => tag.toLowerCase().includes(vt.toLowerCase()))) {
        score += 5;
      }
    });
    
    // Name indicators
    if (repo.name.includes('architecture')) score += 10;
    if (repo.name.includes('platform')) score += 10;
    if (repo.name.includes('engine')) score += 5;
    if (repo.name.includes('enterprise')) score += 10;
    if (repo.name.includes('cloud')) score += 5;
    
    return Math.min(100, score);
  };
  
  // 2. Technical Completeness Assessment
  const assessTechnicalCompleteness = () => {
    let score = 30; // Base score
    
    // API scoring
    const apiCount = repo.metrics?.apiCount || 0;
    if (apiCount > 0) score += Math.min(20, apiCount * 2);
    if (apiCount > 10) score += 10;
    if (apiCount > 20) score += 10;
    
    // API Types
    if (repo.apiTypes?.hasOpenAPI) score += 10;
    if (repo.apiTypes?.hasGraphQL) score += 10;
    if (repo.apiTypes?.hasGrpc) score += 10;
    if (repo.apiTypes?.hasPostman) score += 10;
    
    // Postman collections
    const postmanCount = repo.metrics?.postmanCollections || 0;
    if (postmanCount > 0) score += Math.min(10, postmanCount);
    
    return Math.min(100, score);
  };
  
  // 3. Implementation Readiness Assessment
  const assessImplementationReadiness = () => {
    let score = 40; // Base score
    
    // Has demo URL
    if (repo.demoUrl) score += 20;
    
    // Active status
    if (repo.status === 'active') score += 10;
    
    // Good marketing description
    if (repo.marketingDescription && repo.marketingDescription.length > 100) score += 10;
    
    // Multiple API types indicate good integration
    const apiTypeCount = [
      repo.apiTypes?.hasOpenAPI,
      repo.apiTypes?.hasGraphQL,
      repo.apiTypes?.hasGrpc,
      repo.apiTypes?.hasPostman
    ].filter(Boolean).length;
    
    score += apiTypeCount * 5;
    
    // Recent updates
    const lastUpdated = new Date(repo.metrics?.lastUpdated);
    const daysSinceUpdate = (Date.now() - lastUpdated) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 30) score += 10;
    if (daysSinceUpdate < 7) score += 10;
    
    return Math.min(100, score);
  };
  
  // 4. Business Value Assessment
  const assessBusinessValue = () => {
    let score = 40; // Base score
    
    // High-value domains
    const highValueKeywords = [
      'predictive', 'maintenance', 'payment', 'security', 'compliance',
      'cloud', 'migration', 'transformation', 'automation', 'optimization',
      'real-time', 'analytics', 'intelligence', 'monitoring', 'observability'
    ];
    
    const nameAndDesc = (repo.name + ' ' + repo.description + ' ' + repo.marketingDescription).toLowerCase();
    highValueKeywords.forEach(keyword => {
      if (nameAndDesc.includes(keyword)) score += 5;
    });
    
    // Architecture packages have high business value
    if (repo.name.includes('architecture')) score += 20;
    
    // Platform solutions have high value
    if (repo.category === 'Platform') score += 15;
    
    return Math.min(100, score);
  };
  
  // 5. Ecosystem & Support Assessment
  const assessEcosystem = () => {
    let score = 50; // Base score
    
    // Multiple integrations
    if (repo.metrics?.apiCount > 5) score += 20;
    if (repo.metrics?.postmanCollections > 5) score += 20;
    
    // Modern tech stack indicators
    const modernTech = ['cloud', 'kubernetes', 'docker', 'microservices', 'serverless'];
    modernTech.forEach(tech => {
      if (repo.tags?.some(tag => tag.toLowerCase().includes(tech))) {
        score += 5;
      }
    });
    
    return Math.min(100, score);
  };
  
  // Calculate scores
  scores.domainValue = assessDomainValue();
  scores.technicalCompleteness = assessTechnicalCompleteness();
  scores.implementationReadiness = assessImplementationReadiness();
  scores.businessValue = assessBusinessValue();
  scores.ecosystem = assessEcosystem();
  
  // Calculate weighted overall score
  scores.overall = Math.round(
    scores.domainValue * 0.25 +
    scores.technicalCompleteness * 0.25 +
    scores.implementationReadiness * 0.20 +
    scores.businessValue * 0.20 +
    scores.ecosystem * 0.10
  );
  
  return scores;
}

// Determine pricing based on scores
function determinePricing(repo, scores) {
  const overall = scores.overall;
  let tier, priceRange, suggestedPrice;
  
  if (overall >= 85) {
    tier = 'Tier 4: Strategic';
    priceRange = { min: 150000, max: 500000 };
  } else if (overall >= 70) {
    tier = 'Tier 3: Enterprise';
    priceRange = { min: 50000, max: 150000 };
  } else if (overall >= 55) {
    tier = 'Tier 2: Professional';
    priceRange = { min: 15000, max: 50000 };
  } else if (overall >= 40) {
    tier = 'Tier 1: Foundation';
    priceRange = { min: 5000, max: 15000 };
  } else {
    tier = 'Tier 0: Starter';
    priceRange = { min: 2500, max: 5000 };
  }
  
  // Calculate price within range based on score position
  const tierPosition = (overall - (tier.includes('4') ? 85 : 
                                    tier.includes('3') ? 70 : 
                                    tier.includes('2') ? 55 : 
                                    tier.includes('1') ? 40 : 0)) / 15;
  suggestedPrice = Math.round((priceRange.min + (priceRange.max - priceRange.min) * Math.min(1, tierPosition / 0.7)) / 1000) * 1000;
  
  // Special adjustments
  if (repo.name.includes('architecture') && repo.metrics?.apiCount > 10) {
    suggestedPrice = Math.round(suggestedPrice * 1.3 / 1000) * 1000;
  }
  
  return {
    tier,
    suggestedRetailPrice: suggestedPrice,
    priceRange
  };
}

// Generate value drivers
function generateValueDrivers(repo, scores) {
  const drivers = [];
  
  if (scores.technicalCompleteness > 80) {
    drivers.push(`Comprehensive solution with ${repo.metrics?.apiCount || 0} APIs and full integration suite`);
  }
  
  if (repo.name.includes('architecture')) {
    drivers.push('Complete architecture blueprint reduces design time by 3-6 months');
  }
  
  if (repo.apiTypes?.hasPostman && repo.metrics?.postmanCollections > 5) {
    drivers.push(`${repo.metrics.postmanCollections} ready-to-use Postman collections for rapid testing`);
  }
  
  if (scores.domainValue > 80) {
    drivers.push('Addresses critical business domain with high ROI potential');
  }
  
  if (repo.category === 'AI/ML') {
    drivers.push('AI-powered capabilities provide competitive advantage');
  }
  
  if (repo.demoUrl) {
    drivers.push('Live demo available for immediate evaluation');
  }
  
  if (scores.implementationReadiness > 80) {
    drivers.push('Production-ready with minimal customization needed');
  }
  
  return drivers.slice(0, 3); // Top 3 drivers
}

// Main assessment function
async function assessAllRepositories() {
  console.log('Loading repositories...');
  const repositories = await loadRepositories();
  
  console.log(`Assessing ${repositories.length} repositories...\n`);
  
  const assessments = repositories.map(repo => {
    const scores = assessRepositoryValue(repo);
    const pricing = determinePricing(repo, scores);
    const valueDrivers = generateValueDrivers(repo, scores);
    
    const assessment = {
      repository: repo.name,
      displayName: repo.displayName,
      category: repo.category,
      suggestedRetailPrice: `$${pricing.suggestedRetailPrice.toLocaleString()}`,
      pricingTier: pricing.tier,
      valueScore: scores,
      keyValueDrivers: valueDrivers,
      pricingRationale: `Based on ${repo.metrics?.apiCount || 0} APIs, ${
        ['OpenAPI', 'GraphQL', 'gRPC', 'Postman'].filter(t => 
          repo.apiTypes?.[`has${t}`]
        ).join(', ') || 'standard'
      } integration support, and ${repo.category} domain expertise.`,
      targetBuyer: scores.overall > 70 ? 
        'Enterprise Architect / CTO at Fortune 500' : 
        'Development Team Lead / Technical Manager',
      implementationTimeframe: scores.implementationReadiness > 70 ? 
        '1-2 months' : '2-4 months'
    };
    
    // Add pricing to repo metadata
    repo.pricing = {
      suggestedRetailPrice: pricing.suggestedRetailPrice,
      tier: pricing.tier,
      valueScore: scores.overall,
      lastAssessed: new Date().toISOString()
    };
    
    return assessment;
  });
  
  // Sort by price descending
  assessments.sort((a, b) => {
    const priceA = parseInt(a.suggestedRetailPrice.replace(/[$,]/g, ''));
    const priceB = parseInt(b.suggestedRetailPrice.replace(/[$,]/g, ''));
    return priceB - priceA;
  });
  
  // Display results
  console.log('='.repeat(80));
  console.log('ARCHITECTURE PACKAGE VALUE ASSESSMENT REPORT');
  console.log('='.repeat(80));
  
  assessments.forEach((assessment, index) => {
    console.log(`\n${index + 1}. ${assessment.displayName}`);
    console.log('-'.repeat(60));
    console.log(`   Category: ${assessment.category}`);
    console.log(`   Suggested Price: ${assessment.suggestedRetailPrice}`);
    console.log(`   Pricing Tier: ${assessment.pricingTier}`);
    console.log(`   Overall Score: ${assessment.valueScore.overall}/100`);
    console.log(`   Value Drivers:`);
    assessment.keyValueDrivers.forEach(driver => {
      console.log(`     • ${driver}`);
    });
  });
  
  // Summary statistics
  console.log('\n' + '='.repeat(80));
  console.log('PORTFOLIO SUMMARY');
  console.log('='.repeat(80));
  
  const totalValue = assessments.reduce((sum, a) => 
    sum + parseInt(a.suggestedRetailPrice.replace(/[$,]/g, '')), 0
  );
  
  const tierCounts = assessments.reduce((counts, a) => {
    const tier = a.pricingTier.split(':')[0];
    counts[tier] = (counts[tier] || 0) + 1;
    return counts;
  }, {});
  
  console.log(`Total Portfolio Value: $${totalValue.toLocaleString()}`);
  console.log(`Average Package Price: $${Math.round(totalValue / assessments.length).toLocaleString()}`);
  console.log('\nDistribution by Tier:');
  Object.entries(tierCounts).forEach(([tier, count]) => {
    console.log(`  ${tier}: ${count} packages`);
  });
  
  // Save assessments
  const outputPath = path.join(__dirname, '../data/pricing-assessment.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(assessments, null, 2));
  console.log(`\nDetailed assessment saved to: ${outputPath}`);
  
  // Update repository metadata with pricing
  const updatedRepos = repositories.map(repo => {
    const assessment = assessments.find(a => a.repository === repo.name);
    if (assessment) {
      repo.pricing = {
        suggestedRetailPrice: parseInt(assessment.suggestedRetailPrice.replace(/[$,]/g, '')),
        tier: assessment.pricingTier,
        valueScore: assessment.valueScore.overall,
        lastAssessed: new Date().toISOString()
      };
    }
    return repo;
  });
  
  const metadataPath = path.join(__dirname, '../cache/repositories/metadata-with-pricing.json');
  fs.writeFileSync(metadataPath, JSON.stringify(updatedRepos, null, 2));
  console.log(`Updated metadata saved to: ${metadataPath}`);
}

// Run assessment
assessAllRepositories().catch(console.error);
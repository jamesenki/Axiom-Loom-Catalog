#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Pricing data based on our assessment
const pricingData = {
  "ai-predictive-maintenance-engine-architecture": {
    suggestedRetailPrice: 325000,
    tier: "Tier 4: Strategic",
    valueScore: 88
  },
  "cloudtwin-simulation-platform-architecture": {
    suggestedRetailPrice: 150000,
    tier: "Tier 3: Enterprise",
    valueScore: 82
  },
  "diagnostic-as-code-platform-architecture": {
    suggestedRetailPrice: 150000,
    tier: "Tier 3: Enterprise",
    valueScore: 84
  },
  "NS-Labs-Industrial-dashboards": {
    suggestedRetailPrice: 150000,
    tier: "Tier 3: Enterprise",
    valueScore: 83
  },
  "velocityforge-sdv-platform-architecture": {
    suggestedRetailPrice: 150000,
    tier: "Tier 3: Enterprise",
    valueScore: 83
  },
  "future-mobility-consumer-platform": {
    suggestedRetailPrice: 117000,
    tier: "Tier 3: Enterprise",
    valueScore: 77
  },
  "future-mobility-fleet-platform": {
    suggestedRetailPrice: 117000,
    tier: "Tier 3: Enterprise",
    valueScore: 77
  },
  "deploymaster-sdv-ota-platform": {
    suggestedRetailPrice: 98000,
    tier: "Tier 3: Enterprise",
    valueScore: 75
  },
  "future-mobility-oems-platform": {
    suggestedRetailPrice: 88000,
    tier: "Tier 3: Enterprise",
    valueScore: 74
  },
  "future-mobility-regulatory-platform": {
    suggestedRetailPrice: 88000,
    tier: "Tier 3: Enterprise",
    valueScore: 74
  },
  "future-mobility-tech-platform": {
    suggestedRetailPrice: 79000,
    tier: "Tier 3: Enterprise",
    valueScore: 73
  },
  "future-mobility-utilities-platform": {
    suggestedRetailPrice: 79000,
    tier: "Tier 3: Enterprise",
    valueScore: 73
  },
  "ai-predictive-maintenance-engine": {
    suggestedRetailPrice: 50000,
    tier: "Tier 2: Professional",
    valueScore: 68
  },
  "fleet-digital-twin-platform-architecture": {
    suggestedRetailPrice: 50000,
    tier: "Tier 2: Professional",
    valueScore: 68
  },
  "rental-fleet-management": {
    suggestedRetailPrice: 50000,
    tier: "Tier 2: Professional",
    valueScore: 67
  },
  "sovd-diagnostic-ecosystem-platform-architecture": {
    suggestedRetailPrice: 50000,
    tier: "Tier 2: Professional",
    valueScore: 67
  },
  "sdv-architecture-orchestration": {
    suggestedRetailPrice: 45000,
    tier: "Tier 2: Professional",
    valueScore: 64
  },
  "ai-predictive-maintenance-platform": {
    suggestedRetailPrice: 42000,
    tier: "Tier 2: Professional",
    valueScore: 63
  },
  "remote-diagnostic-assistance-platform-architecture": {
    suggestedRetailPrice: 35000,
    tier: "Tier 2: Professional",
    valueScore: 61
  },
  "mobility-architecture-package-orchestrator": {
    suggestedRetailPrice: 25000,
    tier: "Tier 2: Professional",
    valueScore: 58
  },
  "copilot-architecture-template": {
    suggestedRetailPrice: 18000,
    tier: "Tier 2: Professional",
    valueScore: 56
  },
  "ecosystem-platform-architecture": {
    suggestedRetailPrice: 18000,
    tier: "Tier 2: Professional",
    valueScore: 56
  },
  "ai-transformations": {
    suggestedRetailPrice: 15000,
    tier: "Tier 1: Foundation",
    valueScore: 50
  },
  "future-mobility-energy-platform": {
    suggestedRetailPrice: 15000,
    tier: "Tier 1: Foundation",
    valueScore: 50
  },
  "future-mobility-financial-platform": {
    suggestedRetailPrice: 15000,
    tier: "Tier 1: Foundation",
    valueScore: 50
  },
  "future-mobility-infrastructure-platform": {
    suggestedRetailPrice: 15000,
    tier: "Tier 1: Foundation",
    valueScore: 50
  },
  "future-mobility-users-platform": {
    suggestedRetailPrice: 15000,
    tier: "Tier 1: Foundation",
    valueScore: 50
  },
  "eyns-ai-experience-center": {
    suggestedRetailPrice: 12000,
    tier: "Tier 1: Foundation",
    valueScore: 47
  },
  "sample-arch-package": {
    suggestedRetailPrice: 12000,
    tier: "Tier 1: Foundation",
    valueScore: 47
  }
};

// Load repositories
const repositories = JSON.parse(fs.readFileSync('repositories-temp.json', 'utf8'));

// Add pricing to each repository
const updatedRepos = repositories.map(repo => {
  const pricing = pricingData[repo.name];
  if (pricing) {
    repo.pricing = {
      ...pricing,
      displayPrice: `$${pricing.suggestedRetailPrice.toLocaleString()}`,
      lastAssessed: new Date().toISOString(),
      currency: "USD",
      licensingModel: "Perpetual License",
      supportIncluded: "90 days",
      customizationAvailable: true
    };
  }
  return repo;
});

// Save updated repositories
fs.writeFileSync('repository-metadata.json', JSON.stringify(updatedRepos, null, 2));

console.log(`✅ Added pricing to ${Object.keys(pricingData).length} repositories`);
console.log(`📁 Saved to repository-metadata.json`);

// Also create a pricing summary
const pricingSummary = {
  totalPortfolioValue: Object.values(pricingData).reduce((sum, p) => sum + p.suggestedRetailPrice, 0),
  averagePackagePrice: Math.round(Object.values(pricingData).reduce((sum, p) => sum + p.suggestedRetailPrice, 0) / Object.keys(pricingData).length),
  tierDistribution: Object.values(pricingData).reduce((dist, p) => {
    const tierName = p.tier.split(':')[0];
    dist[tierName] = (dist[tierName] || 0) + 1;
    return dist;
  }, {}),
  topValuePackages: Object.entries(pricingData)
    .sort((a, b) => b[1].suggestedRetailPrice - a[1].suggestedRetailPrice)
    .slice(0, 5)
    .map(([name, data]) => ({
      name,
      price: `$${data.suggestedRetailPrice.toLocaleString()}`,
      tier: data.tier
    })),
  lastUpdated: new Date().toISOString()
};

fs.writeFileSync('pricing-summary.json', JSON.stringify(pricingSummary, null, 2));
console.log(`📊 Pricing summary saved to pricing-summary.json`);
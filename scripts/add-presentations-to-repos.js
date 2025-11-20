#!/usr/bin/env node
/**
 * Add Workshop Presentation Links to Repository Metadata
 *
 * Intelligently maps Gamma presentation URLs to repository metadata based on
 * technical relevance.
 */

const fs = require('fs');
const path = require('path');

// Presentation to Repository Mapping
// Each presentation lists which repositories it's relevant to
const PRESENTATION_MAPPINGS = {
  'ddd-event-sourcing': {
    title: 'Domain-Driven Design & Event Sourcing',
    url: 'https://gamma.app/docs/2pq96a10v6n4e4q',
    repos: [
      'fleet-digital-twin-platform-architecture',
      'diagnostic-as-code-platform-architecture',
      'sovd-diagnostic-ecosystem-platform-architecture',
      'remote-diagnostic-assistance-platform-architecture',
      'sdv-architecture-orchestration',
      'mobility-architecture-package-orchestrator'
    ]
  },
  'microservices-api-design': {
    title: 'Microservices & API Design',
    url: 'https://gamma.app/docs/jfwllxz1pr8cowl',
    repos: [
      'fleet-digital-twin-platform-architecture',
      'vehicle-to-cloud-communications-architecture',
      'sovd-diagnostic-ecosystem-platform-architecture',
      'remote-diagnostic-assistance-platform-architecture',
      'diagnostic-as-code-platform-architecture',
      'deploymaster-sdv-ota-platform',
      'velocityforge-sdv-platform-architecture'
    ]
  },
  'cloud-native-architecture': {
    title: 'Cloud-Native Architecture',
    url: 'https://gamma.app/docs/7mvehp2pwaxcf4c',
    repos: [
      'fleet-digital-twin-platform-architecture',
      'cloudtwin-simulation-platform-architecture',
      'vehicle-to-cloud-communications-architecture',
      'deploymaster-sdv-ota-platform',
      'velocityforge-sdv-platform-architecture',
      'sdv-architecture-orchestration'
    ]
  },
  'event-streaming-realtime': {
    title: 'Event Streaming & Real-Time Systems',
    url: 'https://gamma.app/docs/77lmhglwfo447w1',
    repos: [
      'vehicle-to-cloud-communications-architecture',
      'fleet-digital-twin-platform-architecture',
      'sovd-diagnostic-ecosystem-platform-architecture',
      'diagnostic-as-code-platform-architecture',
      'remote-diagnostic-assistance-platform-architecture'
    ]
  },
  'ota-device-management': {
    title: 'Over-the-Air Updates & Device Management',
    url: 'https://gamma.app/docs/p5drozj2zrq3foq',
    repos: [
      'deploymaster-sdv-ota-platform',
      'velocityforge-sdv-platform-architecture',
      'fleet-digital-twin-platform-architecture'
    ]
  },
  'observability-sre': {
    title: 'Observability & Site Reliability Engineering',
    url: 'https://gamma.app/docs/766e5bnuyyb06x0',
    repos: [
      'fleet-digital-twin-platform-architecture',
      'vehicle-to-cloud-communications-architecture',
      'cloudtwin-simulation-platform-architecture',
      'deploymaster-sdv-ota-platform',
      'velocityforge-sdv-platform-architecture',
      'diagnostic-as-code-platform-architecture',
      'sovd-diagnostic-ecosystem-platform-architecture'
    ]
  },
  'security-compliance': {
    title: 'Security & Compliance for Connected Vehicles',
    url: 'https://gamma.app/docs/anwlx3yqfa5vmno',
    repos: [
      'fleet-digital-twin-platform-architecture',
      'vehicle-to-cloud-communications-architecture',
      'deploymaster-sdv-ota-platform',
      'sovd-diagnostic-ecosystem-platform-architecture',
      'velocityforge-sdv-platform-architecture',
      'diagnostic-as-code-platform-architecture'
    ]
  },
  'performance-engineering': {
    title: 'Performance Engineering & Optimization',
    url: 'https://gamma.app/docs/g5btvv7znkfhq8r',
    repos: [
      'fleet-digital-twin-platform-architecture',
      'cloudtwin-simulation-platform-architecture',
      'vehicle-to-cloud-communications-architecture',
      'diagnostic-as-code-platform-architecture',
      'sovd-diagnostic-ecosystem-platform-architecture'
    ]
  }
};

const REPO_BASE_PATH = path.join(__dirname, '../cloned-repositories');

async function addPresentationsToRepo(repoName) {
  const metadataPath = path.join(REPO_BASE_PATH, repoName, '.portal/metadata.json');

  if (!fs.existsSync(metadataPath)) {
    return { repo: repoName, status: 'skipped', reason: 'metadata not found' };
  }

  try {
    // Read existing metadata
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

    // Find relevant presentations for this repo
    const relevantPresentations = [];
    for (const [key, presentation] of Object.entries(PRESENTATION_MAPPINGS)) {
      if (presentation.repos.includes(repoName)) {
        relevantPresentations.push({
          title: presentation.title,
          url: presentation.url
        });
      }
    }

    if (relevantPresentations.length === 0) {
      return { repo: repoName, status: 'skipped', reason: 'no relevant presentations' };
    }

    // Add or update resources.workshopPresentations
    if (!metadata.resources) {
      metadata.resources = {};
    }

    metadata.resources.workshopPresentations = relevantPresentations;

    // Write updated metadata
    fs.writeFileSync(
      metadataPath,
      JSON.stringify(metadata, null, 2) + '\n',
      'utf-8'
    );

    return {
      repo: repoName,
      status: 'success',
      presentationsAdded: relevantPresentations.length
    };

  } catch (error) {
    return {
      repo: repoName,
      status: 'error',
      error: error.message
    };
  }
}

async function main() {
  console.log('\n📚 Adding Workshop Presentations to Repository Metadata\n');
  console.log('='.repeat(80));

  const repos = [
    'cloudtwin-simulation-platform-architecture',
    'deploymaster-sdv-ota-platform',
    'diagnostic-as-code-platform-architecture',
    'fleet-digital-twin-platform-architecture',
    'future-mobility-consumer-platform',
    'future-mobility-enterprise-platform',
    'future-mobility-utilities-platform',
    'mobility-architecture-package-orchestrator',
    'remote-diagnostic-assistance-platform-architecture',
    'sdv-architecture-orchestration',
    'sovd-diagnostic-ecosystem-platform-architecture',
    'vehicle-to-cloud-communications-architecture',
    'velocityforge-sdv-platform-architecture'
  ];

  const results = [];

  for (const repo of repos) {
    const result = await addPresentationsToRepo(repo);
    results.push(result);

    if (result.status === 'success') {
      console.log(`\n✅ ${repo}`);
      console.log(`   Added ${result.presentationsAdded} presentations`);
    } else if (result.status === 'skipped') {
      console.log(`\n⏭️  ${repo}`);
      console.log(`   Skipped: ${result.reason}`);
    } else {
      console.log(`\n❌ ${repo}`);
      console.log(`   Error: ${result.error}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 Summary:\n');

  const successful = results.filter(r => r.status === 'success');
  const skipped = results.filter(r => r.status === 'skipped');
  const errors = results.filter(r => r.status === 'error');

  console.log(`  ✅ Successfully updated: ${successful.length}`);
  console.log(`  ⏭️  Skipped: ${skipped.length}`);
  console.log(`  ❌ Errors: ${errors.length}`);

  if (successful.length > 0) {
    const totalPresentations = successful.reduce((sum, r) => sum + r.presentationsAdded, 0);
    console.log(`\n  📚 Total presentation links added: ${totalPresentations}`);
  }

  console.log('\n✅ Done!\n');
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

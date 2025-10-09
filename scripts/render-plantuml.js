#!/usr/bin/env node

/**
 * PlantUML Diagram Renderer
 *
 * Renders all .puml files in cloned repositories to PNG images
 * for display in Axiom Loom Catalog documentation viewer.
 */

const fs = require('fs');
const path = require('path');
const plantuml = require('node-plantuml');

const CLONED_REPOS_PATH = path.join(__dirname, '../cloned-repositories');

/**
 * Find all .puml files in a directory recursively
 */
function findPumlFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      findPumlFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.puml')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Render a single PlantUML file to PNG
 */
async function renderPumlFile(pumlPath) {
  return new Promise((resolve, reject) => {
    const pngPath = pumlPath.replace(/\.puml$/, '.png');

    console.log(`Rendering: ${path.relative(CLONED_REPOS_PATH, pumlPath)}`);

    const gen = plantuml.generate(pumlPath, { format: 'png' });
    const writeStream = fs.createWriteStream(pngPath);

    gen.out.pipe(writeStream);

    writeStream.on('finish', () => {
      console.log(`  ✓ Created: ${path.relative(CLONED_REPOS_PATH, pngPath)}`);
      resolve(pngPath);
    });

    writeStream.on('error', (error) => {
      console.error(`  ✗ Error: ${error.message}`);
      reject(error);
    });

    gen.out.on('error', (error) => {
      console.error(`  ✗ PlantUML error: ${error.message}`);
      reject(error);
    });
  });
}

/**
 * Main execution
 */
async function main() {
  const repoName = process.argv[2];

  let searchPath = CLONED_REPOS_PATH;
  if (repoName) {
    searchPath = path.join(CLONED_REPOS_PATH, repoName);
    if (!fs.existsSync(searchPath)) {
      console.error(`Error: Repository '${repoName}' not found`);
      process.exit(1);
    }
    console.log(`Rendering PlantUML diagrams in repository: ${repoName}\n`);
  } else {
    console.log('Rendering PlantUML diagrams in all repositories\n');
  }

  const pumlFiles = findPumlFiles(searchPath);

  if (pumlFiles.length === 0) {
    console.log('No .puml files found');
    return;
  }

  console.log(`Found ${pumlFiles.length} PlantUML files\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const pumlFile of pumlFiles) {
    try {
      await renderPumlFile(pumlFile);
      successCount++;
    } catch (error) {
      errorCount++;
    }
  }

  console.log(`\nCompleted: ${successCount} rendered, ${errorCount} errors`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

#!/usr/bin/env node

const fs = require('fs');

// Load the array format
const reposArray = JSON.parse(fs.readFileSync('repository-metadata.json', 'utf8'));

// Convert to object format keyed by repo name
const reposObject = {};
reposArray.forEach(repo => {
  reposObject[repo.name] = repo;
});

// Save as object format
fs.writeFileSync('repository-metadata.json', JSON.stringify(reposObject, null, 2));

console.log(`✅ Converted ${Object.keys(reposObject).length} repositories to object format`);
console.log(`📁 Saved to repository-metadata.json`);
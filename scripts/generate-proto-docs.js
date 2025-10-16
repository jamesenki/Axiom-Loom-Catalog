#!/usr/bin/env node

/**
 * Protocol Buffer Documentation Generator
 *
 * Generates comprehensive markdown documentation for Protocol Buffer files
 * including:
 * - Description and overview
 * - MQTT topics (from AsyncAPI)
 * - Orchestration/sequence diagrams (PlantUML)
 * - Message and field tables
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const CLONED_REPOS_PATH = path.join(__dirname, '../cloned-repositories');

/**
 * Parse a proto file and extract messages, enums, and packages
 */
function parseProtoFile(content, fileName) {
  const result = {
    package: '',
    messages: [],
    enums: [],
    comments: []
  };

  const lines = content.split('\n');
  let currentComment = [];
  let inMessage = false;
  let inEnum = false;
  let currentMessage = null;
  let currentEnum = null;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Extract comments
    if (line.startsWith('//')) {
      currentComment.push(line.substring(2).trim());
      continue;
    }

    // Extract package
    const packageMatch = line.match(/^package\s+([^;]+);/);
    if (packageMatch) {
      result.package = packageMatch[1];
      currentComment = [];
      continue;
    }

    // Extract message
    const messageMatch = line.match(/^message\s+(\w+)\s*\{?/);
    if (messageMatch && !inMessage) {
      currentMessage = {
        name: messageMatch[1],
        fields: [],
        description: currentComment.join(' ')
      };
      inMessage = true;
      braceDepth = line.includes('{') ? 1 : 0;
      currentComment = [];
      continue;
    }

    // Extract enum
    const enumMatch = line.match(/^enum\s+(\w+)\s*\{?/);
    if (enumMatch && !inEnum) {
      currentEnum = {
        name: enumMatch[1],
        values: [],
        description: currentComment.join(' ')
      };
      inEnum = true;
      braceDepth = line.includes('{') ? 1 : 0;
      currentComment = [];
      continue;
    }

    // Track brace depth
    if (line.includes('{')) braceDepth++;
    if (line.includes('}')) braceDepth--;

    // Extract message fields
    if (inMessage && currentMessage) {
      const fieldMatch = line.match(/^(optional|required|repeated)?\s*(\w+)\s+(\w+)\s*=\s*(\d+);?/);
      if (fieldMatch) {
        currentMessage.fields.push({
          modifier: fieldMatch[1] || '',
          type: fieldMatch[2],
          name: fieldMatch[3],
          number: fieldMatch[4],
          description: currentComment.join(' ')
        });
        currentComment = [];
      }

      if (braceDepth === 0) {
        result.messages.push(currentMessage);
        currentMessage = null;
        inMessage = false;
      }
    }

    // Extract enum values
    if (inEnum && currentEnum) {
      const enumValueMatch = line.match(/^(\w+)\s*=\s*(\d+);?/);
      if (enumValueMatch) {
        currentEnum.values.push({
          name: enumValueMatch[1],
          value: enumValueMatch[2],
          description: currentComment.join(' ')
        });
        currentComment = [];
      }

      if (braceDepth === 0) {
        result.enums.push(currentEnum);
        currentEnum = null;
        inEnum = false;
      }
    }

    // Clear comment if we hit a non-comment, non-match line
    if (!line.startsWith('//') && !line.match(/^\s*$/)) {
      currentComment = [];
    }
  }

  return result;
}

/**
 * Load AsyncAPI specification if available
 */
function loadAsyncAPI(repoPath) {
  const asyncApiPath = path.join(repoPath, 'asyncapi.yaml');
  if (fs.existsSync(asyncApiPath)) {
    try {
      const content = fs.readFileSync(asyncApiPath, 'utf8');
      return yaml.load(content);
    } catch (error) {
      console.warn('Warning: Could not parse asyncapi.yaml:', error.message);
    }
  }
  return null;
}

/**
 * Find PlantUML sequence diagrams
 */
function findSequenceDiagrams(repoPath) {
  const diagrams = [];
  const pumlDir = path.join(repoPath, 'src/main/doc/puml');

  if (fs.existsSync(pumlDir)) {
    const files = fs.readdirSync(pumlDir);
    for (const file of files) {
      if (file.endsWith('.png')) {
        diagrams.push({
          name: file.replace('.png', ''),
          path: `src/main/doc/puml/${file}`
        });
      }
    }
  }

  return diagrams;
}

/**
 * Generate markdown documentation
 */
function generateMarkdown(repoName, protoFiles, asyncApi, diagrams) {
  let md = `# Protocol Buffer Message Specifications\n\n`;
  md += `> Vehicle-to-Cloud Communications Architecture - MQTT Message Definitions\n\n`;

  // Overview section
  md += `## Overview\n\n`;
  md += `This document provides comprehensive documentation for all Protocol Buffer message definitions used in the Vehicle-to-Cloud communications architecture. `;
  md += `These messages are serialized and transmitted over MQTT 5.0 protocol as defined in the AsyncAPI specification.\n\n`;

  // MQTT Topics section (from AsyncAPI)
  if (asyncApi && asyncApi.channels) {
    md += `## MQTT Topics\n\n`;
    md += `The following MQTT topics are used for publishing and subscribing to vehicle messages:\n\n`;
    md += `| Topic Pattern | QoS | Direction | Description |\n`;
    md += `|--------------|-----|-----------|-------------|\n`;

    Object.entries(asyncApi.channels).forEach(([channelKey, channel]) => {
      const address = channel.address || channelKey;
      const qos = channel.bindings?.mqtt?.qos || 1;
      const operations = [];

      // Determine direction from operations
      if (asyncApi.operations) {
        Object.values(asyncApi.operations).forEach(op => {
          if (op.channel?.$ref?.includes(channelKey)) {
            operations.push(op.action);
          }
        });
      }

      const direction = operations.includes('send') ? 'Publish' : operations.includes('receive') ? 'Subscribe' : 'Both';
      const description = channel.description || channel.messages?.[Object.keys(channel.messages)[0]]?.description || '';

      md += `| \`${address}\` | ${qos} | ${direction} | ${description.split('\n')[0]} |\n`;
    });

    md += `\n`;
  }

  // Architecture Diagrams section
  if (diagrams.length > 0) {
    md += `## Architecture Diagrams\n\n`;

    diagrams.forEach(diagram => {
      const title = diagram.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      md += `### ${title}\n\n`;
      md += `![${title}](${diagram.path})\n\n`;
    });
  }

  // Message Definitions section
  md += `## Message Definitions\n\n`;

  // Group proto files by package
  const packageGroups = {};
  protoFiles.forEach(proto => {
    const pkg = proto.package || 'default';
    if (!packageGroups[pkg]) {
      packageGroups[pkg] = [];
    }
    packageGroups[pkg].push(proto);
  });

  Object.entries(packageGroups).forEach(([pkg, protos]) => {
    if (pkg !== 'default') {
      md += `### Package: \`${pkg}\`\n\n`;
    }

    protos.forEach(proto => {
      // Enums
      proto.enums.forEach(enumDef => {
        md += `#### Enum: ${enumDef.name}\n\n`;
        if (enumDef.description) {
          md += `${enumDef.description}\n\n`;
        }

        md += `| Name | Value | Description |\n`;
        md += `|------|-------|-------------|\n`;
        enumDef.values.forEach(value => {
          md += `| ${value.name} | ${value.value} | ${value.description || ''} |\n`;
        });
        md += `\n`;
      });

      // Messages
      proto.messages.forEach(message => {
        md += `#### Message: ${message.name}\n\n`;
        if (message.description) {
          md += `${message.description}\n\n`;
        }

        if (message.fields.length > 0) {
          md += `**Fields:**\n\n`;
          md += `| Field | Type | Number | Modifier | Description |\n`;
          md += `|-------|------|--------|----------|-------------|\n`;
          message.fields.forEach(field => {
            md += `| ${field.name} | \`${field.type}\` | ${field.number} | ${field.modifier || '-'} | ${field.description || ''} |\n`;
          });
          md += `\n`;
        }
      });
    });
  });

  // Usage Examples section
  md += `## Usage Examples\n\n`;
  md += `### Publishing Telemetry Data\n\n`;
  md += `\`\`\`javascript\n`;
  md += `// Example: Publishing vehicle telemetry over MQTT\n`;
  md += `const telemetry = {\n`;
  md += `  header: {\n`;
  md += `    vehicleId: "VIN123456789",\n`;
  md += `    timestamp: Date.now(),\n`;
  md += `    messageType: "TELEMETRY"\n`;
  md += `  },\n`;
  md += `  speed: 65.5,\n`;
  md += `  engineRpm: 2500,\n`;
  md += `  fuelLevel: 75.0\n`;
  md += `};\n\n`;
  md += `const buffer = VehicleTelemetry.encode(telemetry).finish();\n`;
  md += `await mqttClient.publish('v2c/v1/us-west-2/VIN123456789/telemetry/vehicle', buffer, { qos: 1 });\n`;
  md += `\`\`\`\n\n`;

  md += `### Subscribing to Commands\n\n`;
  md += `\`\`\`javascript\n`;
  md += `// Example: Subscribing to remote commands\n`;
  md += `await mqttClient.subscribe('v2c/v1/us-west-2/VIN123456789/command/request', { qos: 1 });\n\n`;
  md += `mqttClient.on('message', (topic, message) => {\n`;
  md += `  const command = RemoteCommandRequest.decode(message);\n`;
  md += `  console.log('Received command:', command.commandType);\n`;
  md += `  // Process command...\n`;
  md += `});\n`;
  md += `\`\`\`\n\n`;

  // Footer
  md += `---\n\n`;
  md += `*Generated on ${new Date().toISOString()}*\n`;
  md += `*For complete API specifications, see [AsyncAPI](asyncapi.yaml)*\n`;

  return md;
}

/**
 * Main execution
 */
async function main() {
  const repoName = process.argv[2];

  if (!repoName) {
    console.error('Usage: node generate-proto-docs.js <repository-name>');
    process.exit(1);
  }

  const repoPath = path.join(CLONED_REPOS_PATH, repoName);
  if (!fs.existsSync(repoPath)) {
    console.error(`Error: Repository '${repoName}' not found`);
    process.exit(1);
  }

  console.log(`Generating Protocol Buffer documentation for: ${repoName}\n`);

  // Find all proto files
  const protoDir = path.join(repoPath, 'src/main/proto');
  if (!fs.existsSync(protoDir)) {
    console.error(`Error: Proto directory not found: ${protoDir}`);
    process.exit(1);
  }

  const protoFiles = [];
  function findProtoFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        findProtoFiles(fullPath);
      } else if (entry.name.endsWith('.proto')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const parsed = parseProtoFile(content, entry.name);
        parsed.fileName = entry.name;
        protoFiles.push(parsed);
      }
    }
  }

  findProtoFiles(protoDir);
  console.log(`Found ${protoFiles.length} proto files`);

  // Load AsyncAPI
  const asyncApi = loadAsyncAPI(repoPath);
  if (asyncApi) {
    console.log(`Loaded AsyncAPI specification`);
  }

  // Find sequence diagrams
  const diagrams = findSequenceDiagrams(repoPath);
  console.log(`Found ${diagrams.length} architecture diagrams`);

  // Generate markdown
  const markdown = generateMarkdown(repoName, protoFiles, asyncApi, diagrams);

  // Write to file
  const outputPath = path.join(repoPath, 'docs', 'PROTOCOL_BUFFERS.md');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, markdown);

  console.log(`\n✓ Documentation generated: ${path.relative(CLONED_REPOS_PATH, outputPath)}`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

const fs = require('fs').promises;
const path = require('path');

const REPO_DIR = path.join(__dirname, '../cloned-repositories/future-mobility-consumer-platform');

const apiNumbers = [2, 8, 9, 10, 14, 24, 29, 31, 33, 34];

const apiNames = {
  2: 'Consumer Profile Management',
  8: 'Charging Network Integration',
  9: 'Route Optimization Service',
  10: 'Payment Processing',
  14: 'Mobility Marketplace',
  24: 'Vehicle Health Monitoring', 
  29: 'Energy Management',
  31: 'Smart City Integration',
  33: 'Subscription Management',
  34: 'Analytics & Insights'
};

async function createImplementationGuide(apiNum) {
  const content = `# API ${apiNum} - ${apiNames[apiNum]} Implementation Guide

## Overview

This guide provides detailed instructions for implementing the ${apiNames[apiNum]} API.

## Quick Start

1. Review the [API specification](../${`api-${apiNum}-openapi.yml`})
2. Set up authentication credentials
3. Configure your development environment
4. Make your first API call

## Authentication

All API requests require authentication using OAuth 2.0 Bearer tokens:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  https://api.future-mobility.com/v1/api-${apiNum}/endpoint
\`\`\`

## Core Endpoints

### GET /api-${apiNum}/status
Check the API health and availability.

### POST /api-${apiNum}/resource
Create a new resource.

### GET /api-${apiNum}/resource/{id}
Retrieve a specific resource.

### PUT /api-${apiNum}/resource/{id}
Update an existing resource.

### DELETE /api-${apiNum}/resource/{id}
Delete a resource.

## Error Handling

The API returns standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Rate Limiting

- Default: 1000 requests per hour
- Burst: 50 requests per minute

## Examples

### JavaScript
\`\`\`javascript
const response = await fetch('https://api.future-mobility.com/v1/api-${apiNum}/resource', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
\`\`\`

### Python
\`\`\`python
import requests

response = requests.get(
    'https://api.future-mobility.com/v1/api-${apiNum}/resource',
    headers={'Authorization': 'Bearer YOUR_TOKEN'}
)
data = response.json()
\`\`\`

## Testing

Use the [Postman collection](./postman-collection.json) for testing API endpoints.

## Support

- Documentation: [API Reference](../index.md)
- Support: api-support@future-mobility.com`;

  const filePath = path.join(REPO_DIR, `docs/api-specs/api-${apiNum}/implementation-guide.md`);
  await fs.writeFile(filePath, content);
  console.log(`Created: ${filePath}`);
}

async function createPostmanCollection(apiNum) {
  const collection = {
    info: {
      name: `API ${apiNum} - ${apiNames[apiNum]}`,
      description: `Postman collection for testing ${apiNames[apiNum]} API`,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [
      {
        name: "Health Check",
        request: {
          method: "GET",
          header: [
            {
              key: "Authorization",
              value: "Bearer {{token}}",
              type: "text"
            }
          ],
          url: {
            raw: "{{baseUrl}}/api-" + apiNum + "/status",
            host: ["{{baseUrl}}"],
            path: ["api-" + apiNum, "status"]
          }
        }
      },
      {
        name: "List Resources",
        request: {
          method: "GET",
          header: [
            {
              key: "Authorization",
              value: "Bearer {{token}}",
              type: "text"
            }
          ],
          url: {
            raw: "{{baseUrl}}/api-" + apiNum + "/resources",
            host: ["{{baseUrl}}"],
            path: ["api-" + apiNum, "resources"]
          }
        }
      },
      {
        name: "Create Resource",
        request: {
          method: "POST",
          header: [
            {
              key: "Authorization",
              value: "Bearer {{token}}",
              type: "text"
            },
            {
              key: "Content-Type",
              value: "application/json",
              type: "text"
            }
          ],
          body: {
            mode: "raw",
            raw: JSON.stringify({
              name: "Sample Resource",
              description: "Created via Postman"
            }, null, 2)
          },
          url: {
            raw: "{{baseUrl}}/api-" + apiNum + "/resources",
            host: ["{{baseUrl}}"],
            path: ["api-" + apiNum, "resources"]
          }
        }
      }
    ],
    variable: [
      {
        key: "baseUrl",
        value: "https://api.future-mobility.com/v1",
        type: "string"
      },
      {
        key: "token",
        value: "",
        type: "string"
      }
    ]
  };

  const filePath = path.join(REPO_DIR, `docs/api-specs/api-${apiNum}/postman-collection.json`);
  await fs.writeFile(filePath, JSON.stringify(collection, null, 2));
  console.log(`Created: ${filePath}`);
}

async function main() {
  // Create directories
  for (const apiNum of apiNumbers) {
    const dir = path.join(REPO_DIR, `docs/api-specs/api-${apiNum}`);
    await fs.mkdir(dir, { recursive: true });
  }

  // Create files
  for (const apiNum of apiNumbers) {
    await createImplementationGuide(apiNum);
    await createPostmanCollection(apiNum);
  }

  // Also create the postman-collections directory files referenced in api-specs/index.md
  const postmanDir = path.join(REPO_DIR, 'docs/postman-collections');
  await fs.mkdir(postmanDir, { recursive: true });
  
  for (const apiNum of apiNumbers) {
    const source = path.join(REPO_DIR, `docs/api-specs/api-${apiNum}/postman-collection.json`);
    const dest = path.join(postmanDir, `api-${apiNum}-collection.json`);
    const content = await fs.readFile(source, 'utf-8');
    await fs.writeFile(dest, content);
    console.log(`Copied to: ${dest}`);
  }

  console.log('\nAll missing files created successfully!');
}

main().catch(console.error);
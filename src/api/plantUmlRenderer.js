/**
 * PlantUML Renderer API
 * 
 * Provides endpoints for rendering PlantUML diagrams
 * Supports various diagram types including C4 architecture diagrams
 */

const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Cache directory for rendered diagrams
const CACHE_DIR = path.join(__dirname, '../../cache/plantuml');
const PLANTUML_JAR = path.join(__dirname, '../../lib/plantuml.jar');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * Generate cache key for PlantUML content
 */
const generateCacheKey = (content) => {
  return crypto.createHash('md5').update(content).digest('hex');
};

/**
 * Check if PlantUML JAR exists
 */
const checkPlantUmlJar = () => {
  if (!fs.existsSync(PLANTUML_JAR)) {
    console.warn('PlantUML JAR not found. Please download plantuml.jar and place it in lib/ directory');
    return false;
  }
  return true;
};

/**
 * Render PlantUML diagram
 */
router.post('/plantuml/render', async (req, res) => {
  try {
    const { content, format = 'svg' } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'PlantUML content is required' });
    }

    // Check if PlantUML JAR exists
    if (!checkPlantUmlJar()) {
      return res.status(503).json({ 
        error: 'PlantUML service unavailable', 
        details: 'PlantUML JAR not found. Please contact administrator.' 
      });
    }

    // Generate cache key
    const cacheKey = generateCacheKey(content + format);
    const cachedFile = path.join(CACHE_DIR, `${cacheKey}.${format}`);

    // Check cache
    if (fs.existsSync(cachedFile)) {
      const cachedContent = fs.readFileSync(cachedFile);
      return res.type(format === 'svg' ? 'image/svg+xml' : 'image/png').send(cachedContent);
    }

    // Create temporary file for PlantUML content
    const tempFile = path.join(CACHE_DIR, `${cacheKey}.puml`);
    
    // Preprocess content to use absolute paths for includes
    let processedContent = content;
    const c4Path = path.join(__dirname, '../../lib/plantuml-stdlib/C4-PlantUML');
    
    // Replace relative C4 includes with absolute paths
    processedContent = processedContent.replace(/!include\s+C4_Context\.puml/g, `!include ${c4Path}/C4_Context.puml`);
    processedContent = processedContent.replace(/!include\s+C4_Container\.puml/g, `!include ${c4Path}/C4_Container.puml`);
    processedContent = processedContent.replace(/!include\s+C4_Component\.puml/g, `!include ${c4Path}/C4_Component.puml`);
    processedContent = processedContent.replace(/!include\s+C4_Deployment\.puml/g, `!include ${c4Path}/C4_Deployment.puml`);
    processedContent = processedContent.replace(/!include\s+C4\.puml/g, `!include ${c4Path}/C4.puml`);
    
    // Write processed content
    fs.writeFileSync(tempFile, processedContent);
    
    // Execute PlantUML with RELATIVE_INCLUDE for nested includes
    const outputFormat = format === 'svg' ? '-tsvg' : '-tpng';
    const command = `java -jar "${PLANTUML_JAR}" -DRELATIVE_INCLUDE="relative" ${outputFormat} "${tempFile}"`;

    exec(command, (error, stdout, stderr) => {
      // Clean up temp file
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }

      if (error) {
        console.error('PlantUML rendering error:', error);
        return res.status(500).json({ 
          error: 'Failed to render diagram', 
          details: stderr || error.message 
        });
      }

      // Read the generated file
      const outputFile = path.join(CACHE_DIR, `${cacheKey}.${format}`);
      if (!fs.existsSync(outputFile)) {
        return res.status(500).json({ 
          error: 'Failed to generate diagram file' 
        });
      }

      const renderedContent = fs.readFileSync(outputFile);
      res.type(format === 'svg' ? 'image/svg+xml' : 'image/png').send(renderedContent);
    });
  } catch (error) {
    console.error('PlantUML API error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

/**
 * Validate PlantUML syntax
 */
router.post('/plantuml/validate', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'PlantUML content is required' });
    }

    // Check if PlantUML JAR exists
    if (!checkPlantUmlJar()) {
      return res.status(503).json({ 
        error: 'PlantUML service unavailable' 
      });
    }

    // Basic syntax validation
    const isValid = content.includes('@startuml') && content.includes('@enduml');
    
    if (!isValid) {
      return res.json({ 
        valid: false, 
        error: 'PlantUML diagram must start with @startuml and end with @enduml' 
      });
    }

    // Try to render with syntax check only
    const tempFile = path.join(CACHE_DIR, `validate-${Date.now()}.puml`);
    fs.writeFileSync(tempFile, content);

    const c4Path = path.join(__dirname, '../../lib/plantuml-stdlib/C4-PlantUML');
    const includeC4 = `-I"${c4Path}"`;
    const defineRelative = '-DRELATIVE_INCLUDE="relative"';
    const command = `java -jar "${PLANTUML_JAR}" ${defineRelative} ${includeC4} -syntax "${tempFile}"`;

    exec(command, (error, stdout, stderr) => {
      // Clean up temp file
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }

      if (error || stderr.includes('Error')) {
        return res.json({ 
          valid: false, 
          error: stderr || 'Invalid PlantUML syntax' 
        });
      }

      res.json({ valid: true });
    });
  } catch (error) {
    console.error('PlantUML validation error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

/**
 * Get PlantUML examples
 */
router.get('/plantuml/examples', (req, res) => {
  const examples = {
    sequence: `@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: Another authentication Response
@enduml`,
    
    class: `@startuml
class Car {
  -String model
  -String manufacturer
  +void start()
  +void stop()
}

class Engine {
  -int horsepower
  +void run()
}

Car "1" *-- "1" Engine : has
@enduml`,
    
    c4Container: `@startuml
!include C4_Container.puml

Person(user, "User", "A user of the system")
System_Boundary(c1, "Banking System") {
    Container(web_app, "Web Application", "React", "Provides banking functionality")
    Container(api, "API Application", "Node.js", "Provides banking API")
    ContainerDb(db, "Database", "PostgreSQL", "Stores user information")
}

Rel(user, web_app, "Uses", "HTTPS")
Rel(web_app, api, "Makes API calls to", "JSON/HTTPS")
Rel(api, db, "Reads from and writes to", "SQL")
@enduml`,

    c4Component: `@startuml
!include C4_Component.puml

Container_Boundary(api, "API Application") {
    Component(sign_in, "Sign In Controller", "Node.js", "Allows users to sign in")
    Component(security, "Security Component", "Node.js", "Provides functionality related to signing in")
    Component(accounts, "Accounts Repository", "Node.js", "Provides access to account data")
}

Rel(sign_in, security, "Uses")
Rel(security, accounts, "Uses")
@enduml`
  };

  res.json(examples);
});

/**
 * Clear PlantUML cache
 */
router.delete('/plantuml/cache', (req, res) => {
  try {
    const files = fs.readdirSync(CACHE_DIR);
    let deletedCount = 0;

    files.forEach(file => {
      if (file.endsWith('.svg') || file.endsWith('.png')) {
        fs.unlinkSync(path.join(CACHE_DIR, file));
        deletedCount++;
      }
    });

    res.json({ 
      message: 'Cache cleared successfully', 
      deletedFiles: deletedCount 
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    res.status(500).json({ 
      error: 'Failed to clear cache', 
      details: error.message 
    });
  }
});

module.exports = router;
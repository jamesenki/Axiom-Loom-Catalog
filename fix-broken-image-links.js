const fs = require('fs');
const path = require('path');

const repoPath = 'cloned-repositories/vehicle-to-cloud-communications-architecture';

// Files and their broken image references to fix
const fixes = [
  {
    file: 'docs/DOCUMENTATION_SOLUTIONS.md',
    replacements: [
      { old: '![C4 Architecture](src/main/doc/puml/C4_Project_Architecture.png)', new: '![C4 Architecture](../src/main/doc/puml/C4_Project_Architecture.png)' },
      { old: '![MQTT Lifecycle](src/main/doc/puml/mqtt_client_message_life_cycle.png)', new: '![MQTT Lifecycle](../src/main/doc/puml/mqtt_client_message_life_cycle.png)' }
    ]
  },
  {
    file: 'docs/PROTOCOL_BUFFERS.md',
    replacements: [
      { old: '![C4 Project Architecture](src/main/doc/puml/C4_Project_Architecture.png)', new: '![C4 Project Architecture](../src/main/doc/puml/C4_Project_Architecture.png)' },
      { old: '![High and Low Priority](src/main/doc/puml/HighLow.png)', new: '![High and Low Priority](../src/main/doc/puml/HighLow.png)' },
      { old: '![VehicleMessageHeader](src/main/doc/puml/VehicleMessageHeader.png)', new: '![VehicleMessageHeader](../src/main/doc/puml/VehicleMessageHeader.png)' },
      { old: '![AWS Plant Example](src/main/doc/puml/aws_plant_example.png)', new: '![AWS Plant Example](../src/main/doc/puml/aws_plant_example.png)' },
      { old: '![MQTT Client Message Life Cycle](src/main/doc/puml/mqtt_client_message_life_cycle.png)', new: '![MQTT Client Message Life Cycle](../src/main/doc/puml/mqtt_client_message_life_cycle.png)' },
      // Remove references to HeaderMessage.png which doesn't exist
      { old: '![HeaderMessage.puml](build/resources/main/V2C/images/HeaderMessage.png)', new: '<!-- HeaderMessage diagram not available -->' }
    ]
  },
  {
    file: 'src/main/doc/ v2c.md',
    replacements: [
      // Remove references to HeaderMessage.png which doesn't exist
      { old: '![HeaderMessage.puml](build/resources/main/V2C/images/HeaderMessage.png)', new: '<!-- HeaderMessage diagram not available -->' }
    ]
  }
];

console.log('================================================================================');
console.log('FIXING BROKEN IMAGE LINKS');
console.log('================================================================================\n');

let totalFixed = 0;

fixes.forEach(({ file, replacements }) => {
  const filePath = path.join(repoPath, file);

  console.log(`Processing: ${file}`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ File not found: ${filePath}\n`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let fileFixed = 0;

  replacements.forEach(({ old, new: newText }) => {
    if (content.includes(old)) {
      content = content.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newText);
      fileFixed++;
      totalFixed++;
      console.log(`  ✓ Fixed: ${old.substring(0, 60)}...`);
    }
  });

  if (fileFixed > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Updated ${fileFixed} image link(s) in ${file}\n`);
  } else {
    console.log(`  ℹ️  No changes needed\n`);
  }
});

console.log('================================================================================');
console.log(`COMPLETE: Fixed ${totalFixed} broken image links`);
console.log('================================================================================\n');

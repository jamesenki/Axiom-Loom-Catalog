// Use built-in fetch (Node 18+)

async function testPlantUML() {
  const content = `@startuml
!include C4_Context.puml
Person(user, "User", "A user")
@enduml`;

  try {
    const response = await fetch('http://localhost:3001/api/plantuml/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, format: 'svg' })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', text);
    } else {
      console.log('Success! Content-Type:', response.headers.get('content-type'));
      const svg = await response.text();
      console.log('SVG length:', svg.length);
      console.log('First 200 chars:', svg.substring(0, 200));
    }
  } catch (error) {
    console.error('Failed:', error);
  }
}

testPlantUML();
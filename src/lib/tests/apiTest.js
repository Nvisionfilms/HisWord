// Using native fetch in Node.js
async function testBibleAPIs() {
  console.log('Testing Bible API integrations...\n');

  // Test ESV API
  console.log('Testing ESV API...');
  try {
    const esvResponse = await fetch('https://api.esv.org/v3/passage/search/?q=peace', {
      headers: {
        'Authorization': 'Token bc46cdc614663b62f3e79094130e0d47aa715668'
      }
    });
    const esvData = await esvResponse.json();
    console.log('ESV API Response:', 
      esvData.results ? 
      `Success! Found ${esvData.results.length} results.\nFirst result: ${esvData.results[0]?.content}` : 
      'No results found');
  } catch (error) {
    console.error('ESV API Error:', error.message);
  }

  // Test Bible API
  console.log('\nTesting Bible API...');
  try {
    const bibleResponse = await fetch('https://bible-api.com/john+3:16');
    const bibleData = await bibleResponse.json();
    console.log('Bible API Response:', 
      bibleData.text ? 
      `Success! Retrieved verse:\n${bibleData.text}` : 
      'No verse found');
  } catch (error) {
    console.error('Bible API Error:', error.message);
  }
}

// Run the test
testBibleAPIs().catch(console.error);

import { searchVersesByText } from '../services/verseService';

async function testBibleAPIs() {
  console.log('Testing Bible API integrations...\n');

  // Test cases with different types of queries
  const testQueries = [
    "I'm feeling lost",
    "Need guidance",
    "Marriage trouble",
    "John 3:16", // Direct verse reference
    "peace"      // Simple keyword
  ];

  for (const query of testQueries) {
    console.log(`\nTesting search for: "${query}"`);
    try {
      const results = await searchVersesByText(query, 3); // Limit to 3 results for testing
      console.log(`Found ${results.length} results:`);
      results.forEach((verse, index) => {
        console.log(`\n${index + 1}. ${verse.reference}`);
        console.log(`Text: ${verse.text}`);
        console.log(`Translation: ${verse.translation}`);
        console.log(`Relevance: ${verse.relevance}`);
        console.log(`Keywords: ${verse.keywords?.join(', ')}`);
      });
    } catch (error) {
      console.error(`Error testing "${query}":`, error);
    }
  }
}

// Run the test
testBibleAPIs().catch(console.error);

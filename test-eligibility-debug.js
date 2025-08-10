// Debug eligibility mapping
fetch('http://localhost:5000/api/countries')
  .then(res => res.json())
  .then(countries => {
    console.log('Sample countries:');
    countries.slice(0, 3).forEach(country => {
      console.log(`${country.name} (${country.code}):`);
      console.log('  - isEligible:', country.isEligible);
      console.log('  - eligibleForEvisa:', country.eligibleForEvisa);
      console.log('  - All fields:', Object.keys(country));
    });
    
    // Check specific eligible countries
    const testEligible = ['Afghanistan', 'Algeria', 'Angola'];
    testEligible.forEach(name => {
      const country = countries.find(c => c.name === name);
      if (country) {
        console.log(`\n${name}: isEligible=${country.isEligible}, eligibleForEvisa=${country.eligibleForEvisa}`);
      }
    });
  })
  .catch(err => console.error('Error:', err));
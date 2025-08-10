// Test duplicate countries issue
fetch('http://localhost:5000/api/countries')
  .then(res => res.json())
  .then(countries => {
    console.log('Total countries:', countries.length);
    
    // Check for duplicates by name
    const names = countries.map(c => c.name);
    const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);
    
    if (duplicateNames.length > 0) {
      console.log('DUPLICATE NAMES FOUND:', duplicateNames);
      duplicateNames.forEach(name => {
        const dups = countries.filter(c => c.name === name);
        console.log(`${name}:`, dups.map(d => `${d.code} (ID: ${d.id})`));
      });
    } else {
      console.log('✓ No duplicate country names found');
    }
    
    // Check specific countries
    const testCountries = ['United States', 'United Kingdom', 'Turkey', 'Germany'];
    testCountries.forEach(countryName => {
      const matches = countries.filter(c => c.name === countryName);
      console.log(`${countryName}: ${matches.length} match(es) - ${matches.map(m => m.code).join(', ')}`);
    });
    
    // Test eligibility flags
    const eligibleCount = countries.filter(c => c.eligibleForEvisa).length;
    const ineligibleCount = countries.filter(c => !c.eligibleForEvisa).length;
    console.log(`Eligible for e-visa: ${eligibleCount}, Not eligible: ${ineligibleCount}`);
  })
  .catch(err => console.error('Error:', err));
const fs = require('fs');
const productsFile = fs.readFileSync('./src/data/products.ts', 'utf8');
const storesFile = fs.readFileSync('./src/data/stores.ts', 'utf8');
const mallFile = fs.readFileSync('./src/data/mall3dData.ts', 'utf8');

// Match stores in stores.ts
const storeMatches = [...storesFile.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
// Filter out non-store IDs if any
console.log('Stores in stores.ts (' + storeMatches.length + '):');

// Count products in products.ts per storeId
const storeCounts = {};
storeMatches.forEach(id => storeCounts[id] = 0);

const prodStoreMatches = [...productsFile.matchAll(/"?storeId"?:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
prodStoreMatches.forEach(id => {
  storeCounts[id] = (storeCounts[id] || 0) + 1;
});

// Also check stores in mall3dData.ts
const mallStoreMatches = [...mallFile.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const uniqueMallStores = [...new Set(mallStoreMatches.filter(id => !id.startsWith('floor-') && !id.startsWith('start-')))];

uniqueMallStores.forEach(id => {
  if (storeCounts[id] === undefined) {
    storeCounts[id] = 0;
  }
});

prodStoreMatches.forEach(id => {
  if (storeCounts[id] !== undefined) {
    // already counted
  } else {
    storeCounts[id] = 1;
  }
});

console.log('Store product inventory status:');
for (const [id, count] of Object.entries(storeCounts)) {
  console.log(`  ${id.padEnd(25)} : ${count} products`);
}

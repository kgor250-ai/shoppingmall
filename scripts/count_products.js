const fs = require('fs');
const content = fs.readFileSync('./src/data/products.ts', 'utf8');
const idMatches = content.match(/"id":\s*"[^"]+"|id:\s*'[^']+'/g) || [];
console.log('Total product id declarations found:', idMatches.length);

const storeMatches = content.match(/"store":\s*"[^"]+"|store:\s*'[^']+'/g) || [];
const counts = {};
storeMatches.forEach(m => {
  const name = m.split(':')[1].replace(/['",]/g, '').trim();
  counts[name] = (counts[name] || 0) + 1;
});
console.log('Product counts per store name:');
Object.entries(counts).sort((a,b) => b[1] - a[1]).forEach(([name, c]) => {
  console.log(`  ${name.padEnd(30)}: ${c}`);
});

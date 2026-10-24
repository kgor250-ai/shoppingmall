const fs = require('fs');
let lines = fs.readFileSync('src/data/products.ts', 'utf8').split('\n');
let origStart = lines.findIndex(l => l.includes('] = ['));
let originalProds = lines.slice(origStart + 1).join('\n');

let appendCode = fs.readFileSync('append-products.js', 'utf8');
let newProdsMatch = appendCode.match(/const newProducts = `([\s\S]*?)`;/);
if (!newProdsMatch) {
  console.log('Failed to match');
  process.exit(1);
}
let newProds = newProdsMatch[1];

let final = "import { Product } from './types'\n\nexport const allProducts: Product[] = [\n" + newProds + ',\n' + originalProds;
final = final.replace(/\n\]\n?$/, '\n]\n');

fs.writeFileSync('src/data/products.ts', final);
console.log('Fixed products.ts');

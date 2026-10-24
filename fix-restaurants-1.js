const fs = require('fs');
let content = fs.readFileSync('./src/data/restaurants.ts', 'utf8');

// The issue: mapLocation is inside the first element of signatureDishes array.
// Example:
//       {
//         name: 'Oscietra Caviar Tartlet',
//         desc: 'Crème crue, smoked dashi jelly, 24k gold leaf',
//         price: '₹4,800',
//       
//     mapLocation: {
// ...
//     }},

// We want to move it to the end of the restaurant object.
// The easiest way is to re-parse the file properly. But since we know exactly how the syntax looks, we can do a replace.

content = content.replace(/(\s+price:\s*'[^']+',\s*)mapLocation:\s*\{\s*floor:\s*'[^']+',\s*wing:\s*'[^']+',\s*shopNumber:\s*'[^']+',\s*x:\s*\d+,\s*y:\s*\d+,\s*walkTime:\s*'[^']+',\s*distance:\s*'[^']+',\s*routeSteps:\s*\[[^\]]+\]\s*\}\},/g, (match, p1) => {
  return p1 + "},";
});

// Now we need to append mapLocation correctly at the end of each restaurant object.
// We can use eval to parse the whole array if we export it, but it imports from './types'.
// Let's just strip all mapLocation from restaurants.ts and re-inject it properly.

let cleanContent = fs.readFileSync('e:/project/shoppingmall/shoppingmall/src/data/restaurants.ts', 'utf8');
cleanContent = cleanContent.replace(/mapLocation:\s*\{[\s\S]*?routeSteps:\s*\[[^\]]+\]\s*\}\},?/g, ''); // removes misplaced ones
// wait, the closing brace is lost. Let's do it carefully.

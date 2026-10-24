const fs = require('fs');

let content = fs.readFileSync('./src/data/restaurants.ts', 'utf8');

// The misplaced mapLocation looks like:
//         price: '₹...',
//       
//     mapLocation: {
//       floor: '3',
//       wing: 'West Wing',
//       shopNumber: '3-123',
//       x: 63,
//       y: 21,
//       walkTime: '4 min walk',
//       distance: '123m',
//       routeSteps: ['Depart Central Atrium', 'Walk West Wing', 'Arrive at 3-123']
//     }},
//       {

// We want to extract the mapLocation block, replace it with `\n      },`, and then place the mapLocation at the end of the restaurant object.
// Actually, it's easier to remove it completely first.
content = content.replace(/mapLocation:\s*\{\s*floor:\s*'[^']+',\s*wing:\s*'[^']+',\s*shopNumber:\s*'[^']+',\s*x:\s*\d+,\s*y:\s*\d+,\s*walkTime:\s*'[^']+',\s*distance:\s*'[^']+',\s*routeSteps:\s*\[[^\]]+\]\s*\}\},/g, '},');

fs.writeFileSync('./src/data/restaurants.ts', content);

function generateMapLocation(id, category, floorStr) {
  let floor = '1';
  if (floorStr.includes('Ground') || floorStr.includes('G')) floor = 'G';
  else if (floorStr.includes('02') || floorStr.includes('2nd') || floorStr.includes('2')) floor = '2';
  else if (floorStr.includes('03') || floorStr.includes('3rd') || floorStr.includes('3')) floor = '3';
  else if (floorStr.includes('Basement') || floorStr.includes('B1') || floorStr.includes('P1')) floor = 'P1';

  const wings = ['North Wing', 'South Wing', 'East Wing', 'West Wing', 'Central Atrium'];
  let hash = 0;
  for(let i=0;i<id.length;i++) hash += id.charCodeAt(i);
  const wing = wings[hash % wings.length];
  const x = 20 + (hash % 60);
  const y = 20 + ((hash * 7) % 60);
  const shopNumber = floor + '-' + (100 + (hash % 100));

  return {
    floor, wing, shopNumber, x, y, walkTime: (hash % 5 + 1) + ' min walk', distance: (100 + hash % 200) + 'm', routeSteps: ['Depart Central Atrium', 'Walk ' + wing, 'Arrive at ' + shopNumber]
  };
}

let newContent = fs.readFileSync('./src/data/restaurants.ts', 'utf8');

// Inject right after `id: '...',`
newContent = newContent.replace(/(id:\s*'([^']+)',)/g, (match, fullMatch, id) => {
  // extract floor
  const floorMatch = newContent.match(new RegExp(`id:\\s*'${id}'[\\s\\S]*?floor:\\s*'([^']+)'`));
  const floorStr = floorMatch ? floorMatch[1] : '1';
  
  const mapLoc = generateMapLocation(id, 'dining', floorStr);
  
  const mapLocStr = `
    mapLocation: {
      floor: '${mapLoc.floor}',
      wing: '${mapLoc.wing}',
      shopNumber: '${mapLoc.shopNumber}',
      x: ${mapLoc.x},
      y: ${mapLoc.y},
      walkTime: '${mapLoc.walkTime}',
      distance: '${mapLoc.distance}',
      routeSteps: ['${mapLoc.routeSteps[0]}', '${mapLoc.routeSteps[1]}', '${mapLoc.routeSteps[2]}']
    },`;
    
  return fullMatch + mapLocStr;
});

fs.writeFileSync('./src/data/restaurants.ts', newContent);
console.log('Fixed restaurants.ts');

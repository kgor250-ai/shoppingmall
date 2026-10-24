const fs = require('fs');

function generateMapLocation(id, category, floorStr) {
  let floor = '1';
  if (floorStr.includes('Ground') || floorStr.includes('G')) floor = 'G';
  else if (floorStr.includes('02') || floorStr.includes('2nd') || floorStr.includes('2')) floor = '2';
  else if (floorStr.includes('03') || floorStr.includes('3rd') || floorStr.includes('3')) floor = '3';
  else if (floorStr.includes('Basement') || floorStr.includes('B1') || floorStr.includes('P1')) floor = 'P1';

  const wings = ['North Wing', 'South Wing', 'East Wing', 'West Wing', 'Central Atrium'];
  // deterministic random based on id
  let hash = 0;
  for(let i=0;i<id.length;i++) hash += id.charCodeAt(i);
  const wing = wings[hash % wings.length];
  const x = 20 + (hash % 60); // 20 to 80
  const y = 20 + ((hash * 7) % 60); // 20 to 80
  const shopNumber = floor + '-' + (100 + (hash % 100));

  return {
    floor, wing, shopNumber, x, y, walkTime: (hash % 5 + 1) + ' min walk', distance: (100 + hash % 200) + 'm', routeSteps: ['Depart Central Atrium', 'Walk ' + wing, 'Arrive at ' + shopNumber]
  };
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/\{\s*id:\s*'([^']+)'[\s\S]*?(?=\},?\n\s*\{|\}\s*\])/g, (match, id) => {
    if (match.includes('mapLocation')) return match;
    
    const floorMatch = match.match(/floor:\s*'([^']+)'/);
    const floorStr = floorMatch ? floorMatch[1] : '1';
    
    const categoryMatch = match.match(/category:\s*'([^']+)'/);
    const category = categoryMatch ? categoryMatch[1] : 'store';
    
    const mapLoc = generateMapLocation(id, category, floorStr);
    
    const mapLocStr = `\n    mapLocation: {
      floor: '${mapLoc.floor}',
      wing: '${mapLoc.wing}',
      shopNumber: '${mapLoc.shopNumber}',
      x: ${mapLoc.x},
      y: ${mapLoc.y},
      walkTime: '${mapLoc.walkTime}',
      distance: '${mapLoc.distance}',
      routeSteps: ['${mapLoc.routeSteps[0]}', '${mapLoc.routeSteps[1]}', '${mapLoc.routeSteps[2]}']
    }`;
      
    return match + mapLocStr;
  });

  fs.writeFileSync(filePath, content);
}

processFile('./src/data/stores.ts');
processFile('./src/data/restaurants.ts');
processFile('./src/data/cinema.ts');
processFile('./src/data/entertainment.ts');
processFile('./src/data/services.ts');

console.log('Added mapLocation to all relevant data files');

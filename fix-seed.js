/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
let c = fs.readFileSync('prisma/seed.ts', 'utf8');
c = c.replace(/\\`/g, '`');
c = c.replace(/\\\$/g, '$');
fs.writeFileSync('prisma/seed.ts', c);

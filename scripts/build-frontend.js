const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const frontend = fs.existsSync(path.join(root, 'frontend', 'views'))
  ? path.join(root, 'frontend')
  : root;
const output = path.join(root, 'dist');

fs.mkdirSync(output, { recursive: true });
fs.cpSync(path.join(frontend, 'views'), output, { recursive: true });
fs.cpSync(path.join(frontend, 'public'), output, { recursive: true });

console.log(`Frontend copied to ${path.relative(root, output)}.`);

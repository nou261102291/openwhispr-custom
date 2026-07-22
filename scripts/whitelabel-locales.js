const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('translation.json') || f.endsWith('.json') ).map(f => path.join(localesDir, f));

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const backup = file + '.bak';
  if (!fs.existsSync(backup)) fs.writeFileSync(backup, content, 'utf8');
  const replaced = content.replace(/OpenWhispr/g, 'Mitra').replace(/Open Whispr/g, 'Mitra');
  fs.writeFileSync(file, replaced, 'utf8');
  console.log('Patched', file);
});

console.log('Done. Backups saved with .bak suffix.');

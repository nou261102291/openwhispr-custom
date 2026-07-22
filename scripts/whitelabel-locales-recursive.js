const fs = require('fs');
const path = require('path');

function walk(dir){
  const entries = fs.readdirSync(dir,{withFileTypes:true});
  for(const e of entries){
    const full = path.join(dir,e.name);
    if(e.isDirectory()) walk(full);
    else if(e.isFile() && full.endsWith('.json')){
      const content = fs.readFileSync(full,'utf8');
      if(content.includes('OpenWhispr')){
        const backup = full + '.bak';
        if(!fs.existsSync(backup)) fs.writeFileSync(backup, content, 'utf8');
        const replaced = content.replace(/OpenWhispr/g, 'Mitra').replace(/Open Whispr/g,'Mitra');
        fs.writeFileSync(full, replaced, 'utf8');
        console.log('Patched', full);
      }
    }
  }
}

walk(path.join(__dirname,'..','src','locales'));
console.log('Done.');

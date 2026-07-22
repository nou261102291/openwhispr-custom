const fs = require('fs');
const path = require('path');

const files = [
  'README.md','CHANGELOG.md','CLEANUP_INSTRUCTIONS.md','CLAUDE.md','DEBUG.md','LOCAL_WHISPER_SETUP.md','NEON_AUTH_SETUP.md','TROUBLESHOOTING.md','WINDOWS_TROUBLESHOOTING.md'
].map(f=>path.join(__dirname,'..',f));

files.forEach(f=>{
  if(fs.existsSync(f)){
    const content = fs.readFileSync(f,'utf8');
    if(content.includes('OpenWhispr')){
      fs.writeFileSync(f+'.bak', content, 'utf8');
      const replaced = content.replace(/OpenWhispr/g,'Mitra').replace(/Open Whispr/g,'Mitra');
      fs.writeFileSync(f,replaced,'utf8');
      console.log('Patched',f);
    }
  }
});
console.log('Done docs');

/*
 Generates platform icon assets from src/assets/icon.svg using sharp and png-to-ico.
 Usage:
   npm install sharp png-to-ico --no-save
   node scripts/generate-icons.js
 Outputs into resources/icons/ and src/assets/
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico').default || require('png-to-ico');

const srcSvg = path.join(__dirname, '..', 'src', 'assets', 'icon.svg');
const outDir = path.join(__dirname, '..', 'resources', 'icons');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const sizes = [16,32,48,64,128,256,512,1024];
(async ()=>{
  const pngBuffers = [];
  for(const s of sizes){
    const outP = path.join(outDir, `icon-${s}.png`);
    await sharp(srcSvg).resize(s,s).png().toFile(outP);
    pngBuffers.push(outP);
    console.log('Wrote', outP);
  }

  // create ico from selected sizes (16,32,48,64)
  const icoBuf = await pngToIco(pngBuffers.slice(0,4));
  fs.writeFileSync(path.join(outDir,'icon.ico'), icoBuf);
  console.log('Wrote', path.join(outDir,'icon.ico'));

  // copy 512 -> src/assets/icon.png for app usage
  fs.copyFileSync(path.join(outDir,'icon-512.png'), path.join(__dirname,'..','src','assets','icon.png'));
  console.log('Copied icon-512.png to src/assets/icon.png');
})();

// Generates an ICNS file from PNG using png2icons
const fs = require('fs');
const path = require('path');
const png2icons = require('png2icons');

const iconsDir = path.join(__dirname,'..','resources','icons');
const png512 = path.join(iconsDir,'icon-512.png');
if(!fs.existsSync(png512)){
  console.error('Missing', png512);
  process.exit(1);
}
const pngBuffer = fs.readFileSync(png512);
const icnsBuf = png2icons.createICNS(pngBuffer, png2icons.BICUBIC, false, 0);
if(!icnsBuf){
  console.error('Failed to generate ICNS');
  process.exit(2);
}
const out = path.join(iconsDir,'icon.icns');
fs.writeFileSync(out, icnsBuf);
console.log('Wrote', out);
// copy into src/assets for builder
const target = path.join(__dirname,'..','src','assets','icon.icns');
fs.copyFileSync(out, target);
console.log('Copied to', target);

const fs = require('fs')
const path = require('path')

const outDir = path.join(path.relative('./', __filename), '..', '..', 'items')
  
async function load() {
  console.log(path.join(outDir, '109.png'))
  // const fileStream = fs.createWriteStream('./here');
  // const { default: fetch } = await import('node-fetch')
  // const res = await fetch('https://www.runehq.com/image/itemsdb/a/asmallkey.gif')

  // await new Promise((resolve, reject) => {
  //   res.body.pipe(fileStream);
  //   res.body.on("error", reject);
  //   fileStream.on("finish", resolve);
  // });
}

load()
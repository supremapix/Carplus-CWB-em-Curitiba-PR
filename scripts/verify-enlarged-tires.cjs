const puppeteer = require('puppeteer');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
(async () => {
  const root=path.resolve('dist');
  const server=http.createServer((req,res)=>{
    let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    if(fs.existsSync(file)&&fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
    if(!fs.existsSync(file)) file=path.join(root,'index.html');
    const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};
    res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));

  const production=process.env.TEST_BASE_URL;
  const origin=production||'http://127.0.0.1:4173';
  fs.mkdirSync('../tire-image-evidence',{recursive:true});
  await page.goto(origin+'/pneus',{waitUntil:'networkidle2'});
  await page.click('.carplus-product-card button[aria-label^="Ver pneu"]');
  await page.waitForSelector('.carplus-tire-detail-media');
  const detail=new URL(page.url()).pathname;
  const results=[];
  for(const width of [360,390,1440]){
    await page.setViewport({width,height:1000});
    for(const route of ['/', '/pneus',detail,'/aro/15','/garagem-de-pneus-curitiba']){
      await page.goto(origin+route,{waitUntil:'networkidle2'});
      await page.waitForSelector('.carplus-tire-figure img, .carplus-product-media img');
      await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelector('.carplus-tire-figure, .carplus-product-media').scrollIntoView({block:'center'});});
      await page.waitFor(400);
      const metrics=await page.evaluate(()=>{
        const f=document.querySelector('.carplus-tire-figure, .carplus-product-media'),i=f.querySelector('img'),c=f.querySelector('figcaption'),r=i.getBoundingClientRect();
        return {width:r.width,height:r.height,fit:getComputedStyle(i).objectFit,loaded:i.complete&&i.naturalWidth>0,caption:c?c.innerText:null,overflow:document.documentElement.scrollWidth>innerWidth,captionFits:!c||c.getBoundingClientRect().bottom<=f.getBoundingClientRect().bottom+1};
      });
      assert.equal(metrics.fit,'contain');assert(metrics.loaded);assert(!metrics.overflow);assert(metrics.captionFits);if(route!=='/')assert(metrics.caption.length>10);assert(metrics.width>=120);
      results.push({viewport:width,route,...metrics});
      await page.screenshot({path:'../tire-image-evidence/'+(production?'prod-':'local-')+width+'-'+route.replaceAll('/','_')+'.png'});
    }
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify(results,null,2));
  await browser.close();server.close();
})().catch(error=>{console.error(error);process.exit(1)});

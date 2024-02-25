import path from 'path'

const fs = require('fs');
const dir = process.env.APPDATA + '/Sigmanuts';

// Creating local cache
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir,{encoding:'utf8'});
}

const srcFolder =  path.join(path.join(__dirname, '..'), 'widgets')

fs.cpSync(srcFolder, dir, {recursive: true});

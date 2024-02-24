const WS = require('ws');
const wss = new WS.Server({ port: 6970 });

wss.on('connection', (ws: any) => {
    console.log('Client connected!')
})

import { ipcMain } from "electron"

const WS = require('ws');
const wss = new WS.Server({ port: 6970 });

wss.on('connection', (ws: any) => {
    console.log('Client connected!')

    ws.on('message', function message(data: any, isBinary: any) {
        const message = isBinary ? data : data.toString();
        //@ts-ignore
        wss.clients.forEach(client => client.send(message));
    })

    ipcMain.on('url-change-2', async (event, arg) => {
        //@ts-ignore
        wss.clients.forEach(client => client.send('{ "listener": "url-change" }'));
    })
})


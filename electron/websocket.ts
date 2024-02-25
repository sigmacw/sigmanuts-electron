import { ipcMain } from "electron"
import eventEmitter from './eventEmitter';

const WS = require('ws');
const wss = new WS.Server({ port: 6970 });

wss.on('connection', (ws: any) => {
    console.log('Client connected!')

    // Listen for the 'dataReceived' event
    eventEmitter.on('dataReceived', (data) => {
        // Send the data through WebSocket
        // @ts-ignore
        wss.clients.forEach(client => {
            client.send(JSON.stringify(data));
        });
    });

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


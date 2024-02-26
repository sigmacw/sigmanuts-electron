import { ipcMain } from "electron"
import eventEmitter from './eventEmitter';

const WS = require('ws');
const wss = new WS.Server({ port: 6970 });
const clients = new Map<string, WebSocket>();

wss.on('connection', (ws: any) => {
    console.log('Client connected!')

    if (clients.size > 0) return

    const clientId = generateUniqueId();

    // Store the WebSocket client in the Map
    clients.set(clientId, ws);

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

    ws.on('close', () => {
        // Remove the WebSocket client using the unique identifier when the connection is closed
        clients.delete(clientId);
    });
})

function generateUniqueId(): string {
    // Generate a unique ID using a combination of timestamp and random number
    const timestamp = new Date().getTime().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);

    return `${timestamp}${randomPart}`;
}

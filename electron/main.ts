import { app, BrowserWindow, BrowserView } from 'electron'
import { ipcMain } from "electron"
import eventEmitter from './eventEmitter';

import './websocket'
import './httpserver'
import './storage'

import path from 'path'

const fs = require('fs');
console.log('Started...');

// require('./events.ts');

process.env.ROOT = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.ROOT, 'public')
  : path.join(process.env.ROOT, '.output/public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow
const preload = path.join(process.env.DIST, 'preload.js')
const script = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8')

function twoViews() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    minHeight: 600,
    minWidth: 900,
    webPreferences: {
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
    },
  })

  const chatView = new BrowserView({
    webPreferences: {
      preload,
      contextIsolation: false,
      nodeIntegration: true,
    }
  })
  win.addBrowserView(chatView)

  let wb = win.getBounds()
  chatView.setBounds({ x: 48, y: 0, width: wb.width - 48, height: wb.height - 56 })
  chatView.setAutoResize({ width: true, height: true })
  chatView.webContents.loadURL('https://www.youtube.com/live_chat?is_popout=1&v=jfKfPfyJRdk')
  chatView.webContents.openDevTools()

  var escapedScript = script.replace(/`/g, '\\`');
  escapedScript = escapedScript.replace(/\$/g, '\\$');

  chatView.webContents.executeJavaScript(`
  var scriptElement = document.createElement('script');
  scriptElement.innerHTML = \`${escapedScript}\`;

  document.body.appendChild(scriptElement);
  `)

  const uiView = new BrowserView({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    }
  })

  win.addBrowserView(uiView)

  uiView.setBounds({ x: 0, y: 0, width: wb.width, height: wb.height - 56 })
  uiView.setAutoResize({ width: true, height: true })

  if (process.env.VITE_DEV_SERVER_URL) {
    uiView.webContents.loadURL(process.env.VITE_DEV_SERVER_URL)
    //uiView.webContents.openDevTools()
  } else {
    uiView.webContents.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
  }
  

  let currentURL = chatView.webContents.getURL();

  //
  // Handling UI actions
  //

  // Handle chat open state
  ipcMain.on('open-chat', async (event, arg) => {
    let wb = win.getBounds()
    uiView.setBounds({ x: 0, y: 0, width: 48, height: wb.height - 56 })
    uiView.setAutoResize({ width: false, height: false })
  })

  // Handle navigating away from chat
  ipcMain.on('close-chat', async (event, arg) => {
    let wb = win.getBounds()
    uiView.setBounds({ x: 0, y: 0, width: wb.width, height: wb.height - 56 })
    uiView.setAutoResize({ width: true, height: true })
  })

  // Handle chat URL change
  ipcMain.on('url-change', async (event, arg) => {
    currentURL = arg;
    chatView.webContents.loadURL(arg)
    chatView.webContents.executeJavaScript(`
    var scriptElement = document.createElement('script');
    scriptElement.innerHTML = \`${escapedScript}\`;

    document.body.appendChild(scriptElement);
    `)
  })

  ipcMain.on('toggle-login', async (event, arg) => {
    currentURL = chatView.webContents.getURL();
    chatView.webContents.loadURL(arg)
  })

  ipcMain.on('restore-url', async (event, arg) => {
    chatView.webContents.loadURL(currentURL)
  })

  ipcMain.on('test-item', async (event, arg) => {
    switch (arg) {
      case 'message':
        chatView.webContents.executeJavaScript('addTestMessage()')
        break
      case 'superchat':
        chatView.webContents.executeJavaScript('addTestSuperchat()')
        break
      case 'sticker':
        chatView.webContents.executeJavaScript('addTestSticker()')
        break
      case 'membership':
        chatView.webContents.executeJavaScript('addTestMember()')
        break
      case 'gift':
        chatView.webContents.executeJavaScript('addTestGift()')
        break
    }
  })

  try {
    chatView.webContents.debugger.attach('1.3');
  } catch (err) {
    console.log('Debugger attach failed: ', err);
  }
  
  chatView.webContents.debugger.on('detach', (event, reason) => {
    console.log('Debugger detached due to: ', reason);
  });
  
  chatView.webContents.debugger.on('message', (event, method, params) => {
    if (method === 'Network.responseReceived') {
      chatView.webContents.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId }).then(function(response) {
        if (response.base64Encoded) return

        eventEmitter.emit('dataReceived', response.body)
      });
    }
  })
    
  chatView.webContents.debugger.sendCommand('Network.enable');

  app.on('window-all-closed', () => {
    win.removeBrowserView(chatView)
    app.quit()
  })
}

app.whenReady().then(twoViews)

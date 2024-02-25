import { app, BrowserWindow, BrowserView } from 'electron'
import { ipcMain } from "electron"
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
const script = fs.readFileSync(path.join(process.env.ROOT, 'electron/script.js'), 'utf8')

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

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
  }

  const chatView = new BrowserView({
    webPreferences: {
      preload,
      contextIsolation: false,
      nodeIntegration: true,
    }
  })
  win.addBrowserView(chatView)

  let wb = win.getBounds()
  chatView.setBounds({ x: 48, y: 0, width: 0, height: wb.height - 56 })
  chatView.setAutoResize({ width: false, height: false })
  chatView.webContents.loadURL('https://www.youtube.com/live_chat?is_popout=1&v=jfKfPfyJRdk')
  chatView.webContents.openDevTools()

  var escapedScript = script.replace(/`/g, '\\`');
  escapedScript = escapedScript.replace(/\$/g, '\\$');

  chatView.webContents.executeJavaScript(`
  var scriptElement = document.createElement('script');
  scriptElement.innerHTML = \`${escapedScript}\`;

  document.body.appendChild(scriptElement);
`)

  let currentURL = chatView.webContents.getURL();

  //
  // Handling UI actions
  //

  // Handle chat open state
  ipcMain.on('open-chat', async (event, arg) => {
    let wb = win.getBounds()
    chatView.setBounds({ x: 48, y: 0, width: wb.width - 48, height: wb.height - 56 })
    chatView.setAutoResize({ width: true, height: true })
  })

  // Handle navigating away from chat
  ipcMain.on('close-chat', async (event, arg) => {
    let wb = win.getBounds()
    chatView.setBounds({ x: 48, y: 0, width: 0, height: wb.height - 56 })
    chatView.setAutoResize({ width: false, height: false })
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
    }
  })

  app.on('window-all-closed', () => {
    win.removeBrowserView(chatView)
    app.quit()
  })
}

app.whenReady().then(twoViews)

/* ipcMain.handle('toggle-chat', async (event, arg) => {
  console.log(arg)
}) */

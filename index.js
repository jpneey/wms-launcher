const path = require('path')
const config = require(path.join(__dirname, '..\\extraResources\\config.json'))
const electron = require('electron')
const { app, BrowserWindow, ipcMain } = electron
const shutdown = require('electron-shutdown-command')
const root = config.root
const preload = path.join(__dirname, 'preload.js')

let param = {}

if (config.kiosk) {
  param = {
    resizable: false,
    fullscreen: true,
    minimizable: false,
    frame: false,
    webPreferences: {
      preload,
      enableRemoteModule: true,
      contextIsolation: false
    }
  }
} else {
  param = {
    minWidth: 1280,
    minHeight: 720
  }
}

app.on('ready', () => {
  let window = new BrowserWindow(param)
  window.loadURL(root)
  background(window)
})

const background = (window) => {
  if (!config.kiosk) {
    window.maximize()
    window.setMenuBarVisibility(false)
  }

  ipcMain.on('app-exit', (event, msg) => {
    shutdown.shutdown();
  })

  ipcMain.on('app-reboot', (event, msg) => {
    shutdown.reboot();
  })

  ipcMain.on('app-minimize', (event, msg) => {
    if(msg !== 'Unimex123!') {
      window.webContents.send('error', 'Invalid auth code')
      return
    }
    window.minimize()
  })
}

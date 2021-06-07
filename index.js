const path = require('path')
const electron = require('electron')
const { app, BrowserWindow, ipcMain } = electron
const shutdown = require('electron-shutdown-command')
const root = 'http://192.168.101.88/wms/'
const prel = path.join(__dirname, 'preload.js')


app.on('ready', () => {
  let window = new BrowserWindow({
    resizable: false,
    fullscreen: true,
    minimizable: false,
    frame: false,
    webPreferences: {
      preload: prel,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })
  window.loadURL(root, {"extraHeaders" : "pragma: no-cache\n"})
  background(window)
})

const background = (window) => {
  ipcMain.on('app-exit', (event, msg) => {
    // should shutdown
    // shutdown.shutdown();
    window.close()
  })

  ipcMain.on('app-reboot', (event, msg) => {
    // should reboot
    // shutdown.reboot();
    window.close()
  })

  ipcMain.on('app-minimize', (event, msg) => {
    if(msg !== 'Unimex123!') {
      window.webContents.send('error', 'Invalid auth code')
      return
    }
    window.minimize()
  })
}

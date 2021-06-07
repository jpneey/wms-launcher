const { ipcRenderer } = require('electron');

function initElectron() {
    window.isElectron = true
    window.ipcRenderer = ipcRenderer
}

initElectron();

const {app, BrowserWindow, ipcMain} = require('electron');

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 555,
    resizable: false,
    frame: false
  });

  win.loadURL(`file://${__dirname}/app/index.html`);

  win.webContents.openDevTools();

  // Prevent open new window when user click on a link with shift or ctrl key
  win.webContents.on('new-window', (event) => {
    event.preventDefault();
  });

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

// Handle main application event (minimize, close, Etc.) come from ipcRenderer
ipcMain.on('app', (event, arg) => {
  switch (arg) {
    case 'minimize':
      win.minimize();
      break;
    case 'quit':
      app.quit();
      break;
  }
});

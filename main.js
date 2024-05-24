const { app, BrowserWindow, shell } = require("electron");
let win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: "./public/logo.jpg",
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.loadFile("./public/index.html");
};

app.whenReady().then(() => {
  createWindow();
});

const { app, BrowserWindow, shell, ipcMain } = require("electron");
const ytubes = require("ytubes");
const ytdl = require("ytdl-core");
const path = require("path");
require("electron-simple-updater");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: "./public/logo.jpg",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.loadFile("./public/index.html");
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/*
IPC Start
*/

ipcMain.on("fetch-music", async (event, query) => {
  try {
    const musicResults = await ytubes.getMusic(query);
    event.sender.send("music-fetched", musicResults);
  } catch (error) {
    console.error("Error fetching music:", error);
    event.sender.send("music-fetched", { error: error.message });
  }
});

ipcMain.on("stream-music", async (event, videoId) => {
  try {
    const music = await ytdl.getInfo(videoId);
    const audioFormat = ytdl.chooseFormat(music.formats, {
      quality: "highestaudio",
      filter: "audioonly",
    });
    event.sender.send("stream-url", audioFormat.url);
  } catch (error) {
    console.error("Error streaming music:", error);
    event.sender.send("stream-url", { error: error.message });
  }
});

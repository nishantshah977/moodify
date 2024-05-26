const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("music", {
  fetch: (query) => ipcRenderer.send("fetch-music", query),
  onFetch: (callback) =>
    ipcRenderer.on("music-fetched", (event, musics) => callback(musics)),
  getStream: (url) => ipcRenderer.send("stream-music", url),
  stream: (callback) =>
    ipcRenderer.on("stream-url", (event, url) => callback(url)),
});

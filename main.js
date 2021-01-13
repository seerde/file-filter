const { app, BrowserWindow, ipcMain } = require("electron");
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("keyword", (e, item) => {
  const tmpObj = {
    keyword: item["keyword"],
    targetFolder: item["targetFolder"].replace("\\" + item["tmpT"], ""),
    finalFolder: item["finalFolder"].replace("\\" + item["tmpF"], ""),
  };
  console.log(tmpObj);
  fileFilter(tmpObj);
});

function fileFilter({ keyword, targetFolder, finalFolder }) {
  let fs = require("fs");
  let path = "./data/";
  const loopFolder = (preDir, dir, keyword, finalDir) => {
    let newDir = `${preDir}\\${dir}`;
    console.log(newDir);
    fs.readdir(newDir, (err, files) => {
      files.forEach((e) => {
        if (!e.includes(".")) {
          loopFolder(newDir, e, keyword, finalFolder);
        } else {
          if (e.includes(keyword)) {
            let finalDirWithName = `${finalDir}\\${keyword}\\`;
            if (!fs.existsSync(finalDirWithName)) {
              fs.mkdir(finalDirWithName, (err) => {
                if (err) throw err;
                console.log("created final folder");
              });
            }
            fs.copyFile(`${newDir}\\${e}`, finalDirWithName + e, (err) => {
              if (err) throw err;
              console.log("coppied");
            });
          }
        }
      });
    });
  };
  loopFolder(targetFolder, "", keyword, finalFolder);
  console.log("Job's Done!");
}

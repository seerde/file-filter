const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const os = require('os');
const osName = os.type();
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
    targetFolder: osName.includes("Darwin") ? item["targetFolder"].replace("/" + item["tmpT"], "") : item["targetFolder"].replace("\\" + item["tmpT"], ""),
    finalFolder: osName.includes("Darwin") ? item["finalFolder"].replace("/" + item["tmpF"], "") : item["finalFolder"].replace("\\" + item["tmpF"], ""),
  };
  console.log(tmpObj);
  let myPromise = new Promise(function (resolve, reject) {
    fileFilter(tmpObj, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  });
  myPromise.then((e) => {
    // console.log(dialog.showMessageBox(win, { message: "Job's Done!" }));
    // console.log("Job's Done!");
  }, (err) => {
    console.log(err)
  })
  // fileFilter(tmpObj);
});

function fileFilter({ keyword, targetFolder, finalFolder }, _callback) {
  let fs = require("fs");
  const loopFolder = (preDir, dir, keyword, finalDir, _callback2) => {
    let newDir = osName.includes("Darwin") ? `${preDir}/${dir}` : `${preDir}\\${dir}`;
    fs.readdir(newDir, (err, files) => {
      files.forEach((e) => {
        if (!e.includes(".")) {
          loopFolder(newDir, e, keyword, finalFolder, _callback2);
        } else {
          if (e.includes(keyword)) {
            let finalDirWithName = osName.includes("Darwin") ? `${finalDir}/${keyword}/` : `${finalDir}\\${keyword}\\`;
            console.log(finalDirWithName);
            if (!fs.existsSync(finalDirWithName)) {
              fs.mkdir(finalDirWithName, (err) => {
                if (err) throw err;
                console.log("created final folder");
              });
            }
            fs.copyFile(osName.includes("Darwin") ? `${newDir}/${e}` : `${newDir}\\${e}`, finalDirWithName + e, (err) => {
              if (err) throw err;
              console.log("coppied");
            });
          }
        }
      });
    });
    _callback2(null, { state: true });
  };
  let myPromise = new Promise(function (resolve, reject) {
    loopFolder(targetFolder, "", keyword, finalFolder, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  });
  myPromise.then((e) => {
    console.log(dialog.showMessageBox(win, { message: "Job's Done!" }));
    console.log("Job's Done!");
  }, (err) => {
    console.log(err)
  })
  // loopFolder(targetFolder, "", keyword, finalFolder);
  _callback(null, { state: true });
}

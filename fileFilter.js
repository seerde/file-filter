let fs = require("fs");
let path = "./data/";
const loopFolder = (preDir, dir, keyword) => {
  let newDir = `${preDir}/${dir}`;
  fs.readdir(newDir, (err, files) => {
    files.forEach((e) => {
      if (!e.includes(".")) {
        loopFolder(newDir, e, keyword);
      } else {
        if (e.includes(keyword)) {
          let finalDir = `./${keyword}/`;
          if (!fs.existsSync(finalDir)) {
            fs.mkdir(finalDir, (err) => {
              if (err) throw err;
              console.log("created final folder");
            });
          }
          fs.copyFile(`${newDir}/${e}`, finalDir + e, (err) => {
            if (err) throw err;
            console.log("coppied");
          });
        }
      }
    });
  });
};
loopFolder(".", "data", "CST");
console.log("Job's Done!");

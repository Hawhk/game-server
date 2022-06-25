const fs  = require('fs');
const path = require('path');

const Dirs = ["addons", ".git", ".DS_Store"];

let gamesDir = path.join(__dirname, 'games');
fs.readdirSync(gamesDir).filter((dir) => { // all directories in "games"
    let gameDir = path.join(gamesDir, dir);
    fs.readdirSync(gameDir).filter((file) => { // all files in game directory
        let gameFile = path.join(gameDir,file);
        console.log(gameFile);
        if(fs.statSync(gameFile).isDirectory()) { // if it's a directory
            if (Dirs.indexOf(file) === -1) {
                fs.readdirSync(gameFile).filter((file) => {
                    let newPath = path.join(gameDir, file);
                    let oldPath = path.join(gameFile, file);
                    fs.rename(oldPath, newPath, (err) => {
                        if (err) throw err;
                        console.log("Moved: ", oldPath, " to ", newPath);
                    });
                });
            }
            fs.rmSync(gameFile, { recursive: true, force: true }, (err) => {
                if (err) throw err;
                console.log("Deleted: ", gameFile);
            });
        } else if (file.indexOf('p5') !== -1) { // if it's a p5 file
            fs.unlinkSync(gameFile, (err) => {
                if (err) throw err;
                console.log("Deleted: ", gameFile);
            });
        }
    });
});

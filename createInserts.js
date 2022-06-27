const { Game, Script } = require("./models");
const path = require('path');
const fs = require('fs');

Script.destroy({ truncate: {cascade: true }});
Game.destroy({ truncate: {cascade: true }});

const DirsToDelete = ["addons", ".git", ".DS_Store"];

let gamesDir = path.join(__dirname, 'games');
fs.readdirSync(gamesDir).filter(async (dir) => { // all directories in "games"
    if (!dir.includes("example")) {
        let gameDir = path.join(gamesDir, dir);
        let game = await Game.create({name: dir});
        fs.readdirSync(gameDir).filter((file) => { // all files in game directory
            let gameFile = path.join(gameDir,file);
            if(fs.statSync(gameFile).isDirectory()) { // if it's a directory
                if (DirsToDelete.indexOf(file) === -1) {
                    fs.readdirSync(gameFile).filter((file) => {
                        let newPath = path.join(gameDir, file);
                        let oldPath = path.join(gameFile, file);
                        fs.rename(oldPath, newPath, (err) => {
                            if (err) throw err;
                            console.log("Moved: ", oldPath, " to ", newPath);
                            if (file.endsWith('.html')) {
                                let srcs = findSrc(newPath);
                                srcs.forEach((src, index) => {
                                    if (src.endsWith('.js') !== -1) {
                                        Script.create({game_id: game.id, path: src, nr: index});
                                    }
                                });
                                fs.unlinkSync(newPath, (err) => {
                                    if (err) throw err;
                                    console.log("Deleted: ", newPath);
                                });
                            }  
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
    }
});

function findSrc(path) {
    let html = fs.readFileSync(path).toString();
    // console.log(html);
    let srcStr = 'src=\"';
    let lastIndex = 0; 
    let startIndex = html.indexOf(srcStr);
    let endIndex = 0;
    let result = [];
    while(startIndex != -1) {
        endIndex = html.indexOf('\"', startIndex + srcStr.length);
        let src = html.slice(startIndex + srcStr.length, endIndex);
        result.push(src)
        lastIndex = endIndex + 1;
        startIndex = html.indexOf(srcStr, lastIndex);
    }
    return result;
}
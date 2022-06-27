const { Game, Script } = require("./models");
const path = require('path');
const fs = require('fs');

Script.destroy({ truncate: {cascade: true }});
Game.destroy({ truncate: {cascade: true }});

const DirsToDelete = ["addons", ".git", ".DS_Store"];

let gamesDir = path.join(__dirname, 'games');


fs.readdirSync(gamesDir).filter(async (dir) => { // all directories in "games"
    let gameDir = path.join(gamesDir, dir);
    let jsonPath = path.join(gameDir, 'scripts.json');
    if (!dir.includes("example")) {
        try {
            if(!fs.existsSync(jsonPath)) {
                gameDirFiles(gameDir, jsonPath);
            }
        } catch (err) {
            throw err;
        }
        let srces = await JSON.parse(fs.readFileSync(jsonPath));
        let game = await Game.create({name: dir});
        srces.forEach(src => {
            Script.create({game_id: game.id, path: src.path, nr: src.nr});
        });
    }
});

function gameDirFiles(gameDir, jsonPath){
    fs.readdirSync(gameDir).filter((file) => { // all files in game directory
        let gameFile = path.join(gameDir,file);
        if(fs.statSync(gameFile).isDirectory()) { // if it's a directory
            srcFiles(file, gameFile, gameDir, jsonPath);
        } else if (file.indexOf('p5') !== -1) { // if it's a p5 file
            fs.unlinkSync(gameFile, (err) => {
                if (err) throw err;
                console.log("Deleted: ", gameFile);
            });
        }
    });
}

function srcFiles(file, gameFile, gameDir, jsonPath) {
    if (DirsToDelete.indexOf(file) === -1) {
        fs.readdirSync(gameFile).filter((file) => {
            let newPath = path.join(gameDir, file);
            let oldPath = path.join(gameFile, file);
            moveSrcFiles(file, oldPath, newPath);
            if (file.endsWith('.html')) {
                createGameSrcFile(newPath, jsonPath);
            }
        });
    }
    fs.rmSync(gameFile, { recursive: true, force: true }, (err) => {
        if (err) throw err;
        console.log("Deleted: ", gameFile);
    });
}

function moveSrcFiles(file, oldPath, newPath) {
    
    try {
        fs.renameSync(oldPath, newPath);
        console.log("Moved: ", oldPath, " to ", newPath);
    } catch (err) {
        console.error("Could not move file:", file);
        throw err;
    }
}

function createGameSrcFile(path, jsonPath) {
    let gameSrces = [];
    let srcs = findSrc(path);
    srcs.forEach((src, index) => {
        if (src.endsWith('.js') !== -1) {
            if (src.includes('p5')) {
                console.log("p5 src:", src);
            } else {
                gameSrces.push({path: src, nr: index});
            }
        }
    });
    fs.unlinkSync(path, (err) => {
        if (err) throw err;
        console.log("Deleted: ", path);
    });
    try {
        fs.writeFileSync(jsonPath, JSON.stringify(gameSrces));
    } catch (err) {
        console.error("Could not create file:", jsonPath);
        throw err;
    }
}

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
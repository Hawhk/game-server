const { Game, Script } = require("./models");
const path = require('path');
const fs = require('fs');

const DirsToDelete = ["addons", ".git", ".DS_Store"];

let gamesDir = path.join(__dirname, 'games');

fs.readdirSync(gamesDir).filter(async (dir) => {
    let gameDir = path.join(gamesDir, dir);
    let jsonPath = path.join(gameDir, 'scripts.json');
    if (!dir.includes("example")) {
        try {
            if(!fs.existsSync(jsonPath)) {
                gameDirFiles(gameDir, jsonPath);
            } else if (await changesMade(gameDir, jsonPath)) {
                fs.unlinkSync(jsonPath, (err) => {
                    if (err) throw err;
                    console.log("Deleted: ", jsonPath);
                });
                let htmlPath = path.join(gameDir, 'index.html');
                createGameSrcFile(htmlPath, jsonPath);
            }
        } catch (err) {
            throw err;
        }
        await addOrUpdateGame(dir, jsonPath);
    }
});

async function changesMade(gameDir, jsonPath) {
    let oldSrcesStr = fs.readFileSync(jsonPath);
    let newSrcesStr = JSON.stringify(findSrc(path.join(gameDir, 'index.html')));
    return oldSrcesStr !== newSrcesStr;
}

async function addOrUpdateGame(gameName, jsonPath) {
    let srces = await JSON.parse(fs.readFileSync(jsonPath));
    let game = await Game.findOne({where: {name: gameName}});
    if (!game) {
        game = await Game.create({name: gameName});
    }
    let scripts = await Script.findAll({where: {game_id: game.id}});
    srces.forEach(src => {
        let scriptsByNr = scripts.filter(s => s.nr === src.nr);
        let script = scripts.find(s => s.path === src.path);

        scriptsByNr.forEach(s => {
            if (s.path !== src.path) {
                s.destroy();
                console.log("removed script:", s.path);
            }
        });

        if (script && script.nr !== src.nr) {
            script.update({nr: src.nr});
        } else if (!script) {
            Script.create({
                game_id: game.id, 
                path: src.path, 
                nr: src.nr, 
                type: src.type
            });
        }
    });
}


function gameDirFiles(gameDir, jsonPath){
    fs.readdirSync(gameDir).filter((file) => { // all files in game directory
        let gameFile = path.join(gameDir,file);
        if(fs.statSync(gameFile).isDirectory()) { // if it's a directory
            srcFiles(file, gameFile, gameDir, jsonPath);
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
            let type = "file";
            if (src.startsWith('http://') || src.startsWith('https://')) {
                type = "url";
            }
            gameSrces.push({path: src, nr: index, type: type});
        }
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
const { Game, Script } = require("./models");
const path = require('path');
const fs = require('fs');


const directoryPath = path.join(__dirname, 'games');

Script.destroy({ truncate: {cascade: true }});
Game.destroy({ truncate: {cascade: true }});

fs.readdir(directoryPath, (err, dirs) => {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    dirs.forEach(async (dir) =>  {
        if (!dir.includes("example") || dirs.length == 1) {
            let gameDir = path.join(directoryPath, dir);
            let game = await Game.create({name: dir});
            fs.readdir(gameDir, (err, dirFiles) => {
                for (let i = 0; i < dirFiles.length; i++) {
                    const file = dirFiles[i];
                    if (file.endsWith('.js')) {
                        Script.create({game_id: game.id, path: file, nr: file[0]});
                    }
                }
            });
        }
    });
});
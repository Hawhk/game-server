const express  = require('express');
const router = express.Router();
const { Game, Script } = require('../models');

router.get('/:id', (req, res) => {
    Game.findByPk(req.params.id, { include: [{ model: Script, order: ['nr', 'ASC'] }]} ).then(game => {
        res.render('game', { game: game.dataValues});
    }).catch(err => {
        console.log(err);
    });
});

module.exports=router;
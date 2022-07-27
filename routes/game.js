const express  = require('express');
const router = express.Router();
const { Game, Script } = require('../models');

router.get('/:id', (req, res) => {
    Game.findByPk(req.params.id, { include: [{ model: Script, order: ['nr', 'ASC'] }]} ).then(game => {
        if (game) {
            res.render('game', { game: game.dataValues, user: req.session.user });
        } else {
            res.status(400).send('game not found');
        }
    }).catch(err => {
        res.status(400).send(err.messege);
        console.log(err);
    });
});

module.exports=router;
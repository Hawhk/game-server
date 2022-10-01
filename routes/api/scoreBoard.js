const express = require("express");
const router = express.Router();
const { User, ScoreBoard } = require("../../models");
const { authJwt } = require("../../middleware");

router.get("", async (req, res) => {
    res.send("Welcome to the Scoreboard API");
});

router.get("/all", async (req, res) => {
    ScoreBoard.findAll()
        .then((scoreBoards) => {
            res.json(scoreBoards);
        })
        .catch((err) => {
            res.status(500).json({ message: "Error" });
            console.log(err);
        });
});

router.get("/:id", async (req, res) => {
    ScoreBoard.findByPk(req.params.id)
        .then((scoreBoard) => {
            res.json(scoreBoard);
        })
        .catch((err) => {
            res.status(404).send("Scoreboard not found");
            console.log(err);
        });
});

router.post("/create", async (req, res) => {
    ScoreBoard.create({
        name: req.body.name,
        game_id: req.body.game_id,
    })
        .then((scoreBoard) => {
            res.json(scoreBoard);
        })
        .catch((err) => {
            res.status(500).json({ message: "Error" });
            console.log(err);
        });
});

router.put("/update/:id", async (req, res) => {
    ScoreBoard.update(
        {
            name: req.body.name,
        },
        {
            where: {
                id: req.params.id,
            },
        }
    )
        .then((scoreBoard) => {
            res.json(scoreBoard);
        })
        .catch((err) => {
            res.status(500).json({ message: "Error" });
            console.log(err);
        });
});

router.delete("/delete/:id", async (req, res) => {
    ScoreBoard.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then((scoreBoard) => {
            res.json(scoreBoard);
        })
        .catch((err) => {
            res.status(500).json({ message: "Error" });
            console.log(err);
        });
});

module.exports = router;

-- DROP DATABASE IF EXISTS `games`;
-- CREATE DATABASE `games`;
-- USE `games`;

CREATE TABLE IF NOT EXISTS game(
    id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS script(
    id CHAR(36) NOT NULL,
    game_id CHAR(36) NOT NULL,
    path VARCHAR(255) NOT NULL,
    nr INT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES game(id),
    PRIMARY KEY (id)
);


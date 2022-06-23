CREATE USER 'hawhk'@'localhost' IDENTIFIED WITH authentication_plugin BY 'Hamsteragg1';

CREATE DATABASE IF NOT EXISTS `games`;
USE `games`;

CREATE TABLE IF NOT EXISTS game(
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS includes(
    id CHAR(36) NOT NULL PRIMARY KEY,
    game_id CHAR(36) NOT NULL,
    path VARCHAR(255) NOT NULL,
    FOREIGN KEY (game_id) REFERENCES game(id)
)

INSERT into game(id, name, link, description) 
VALUES (UUID(), 'Solitare', 'solitare/game', 'A solitaire game');




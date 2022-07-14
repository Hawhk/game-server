# Game server for p5.js games

## Installation
Download server from [GitHub](https://github.com/Hawhk/game-server).

Install packages by running `npm install`

Start by running `npm start`

## API
### /api/logs

### /api/logs/`{keyToFilter}`/`{value}`

Finds all log rows where the `{keyToFilter}` is equal (`eq`), not equal (`neq`), greater (`gt`), greater or equal (`ge`), less (`lt`), less or equal (`le`), includes (`ic`) or not includes (`nic`) the `{value}` depending on the query parameter `comp` (short for comparison) given, standard is eq
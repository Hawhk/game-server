# Game server for p5.js games

## Installation
1. Download server from [GitHub](https://github.com/Hawhk/game-server).

2. Install packages by running `npm install`

3. Create database config by `cp config.json.example config.json` and change to your style or run `./setup_database.sh`

4. Start by running `npm start`

## API
### /api/logs

### /api/logs/`{keyToFilter}`/`{value}`

Finds all log rows where the `{keyToFilter}` is equal (`eq`), not equal (`neq`), greater (`gt`), greater or equal (`ge`), less (`lt`), less or equal (`le`), includes (`ic`) or not includes (`nic`) the `{value}` depending on the query parameter `comp` (short for comparison) given, standard is eq


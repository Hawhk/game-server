#TODO: if config dont exsit:
cp config.json.example config.json
#TODO: else: do somthing (ask to continue / abort)
echo "Would you like to setup the database?"
read setupDb
#TODO: start if y 
echo "What database would you like to use?" #TODO: list availeble dbs
read database
#TODO: controll if database is useble
echo "What should the database be called?"
read dbName
#TODO: controll dbName

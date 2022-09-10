#!/usr/bin/env bash
usage() {
    usages=(
        "-d <database dialect>"
        "-n <database name>"
        "-u <database user>"
        "-p <database password>"
        "-h <database host>"
        "-P <database port>"
        "-l <logging true|false>"
        "-s <sqlite path>"
        "-H <help>"
        "-y <create database>"
    )
    echo -e "\nUsage: $0"
    for usage in "${usages[@]}"; do
        echo -e "\t$usage"
    done
    echo

    exit $1
}

message_db_creation() {
    if [ "$?" -eq 0 ]; then
        echo "Database created successfully"
    else
        echo "Error creating database:"
        echo -e "\t\"$1\""
        exit 1
    fi
}

SQL_FILE="./database/create.sql"

d="sqlite"
n="games"
u="root"
p=""
h="localhost"
P="default"
l="true"
s="./database/db.sqlite"
y="false"

while getopts ":d:n:u:ph:l:y" o; do
    case "${o}" in
        d) #database/dialect
            d=${OPTARG}
            ;;
        n) #database name
            n=${OPTARG}
            ;;
        u) #database user
            u=${OPTARG}
            ;;
        p) #database password 
            echo "Enter database password for user \"$u\": "
            read -s p
            ;;
        h)  #database host
            h=${OPTARG}
            ;;
        P) #database port
            p=${OPTARG}
            ;;
        l) #logging true|false
            if [[ $OPTARG == "true" || $OPTARG == "false" ]]; then
                l=${OPTARG}
            else
                echo "Logging must be true or false"
                usage 1
            fi
            ;;
        s) #sqlite path
            s=${OPTARG}
            ;;
        H) #help
            usage 0
            ;;
        y) #sync database
            y="true"
            ;;
        *)
            usage 1
            ;;
    esac
done

if [ "$d" == "sqlite" ]; then
    JSON_STRING='{
    \n\t"dialect":"'$d'",
    \n\t"storage":"'$s'",
    \n\t"logging":'$l'
    \n}'
else
    JSON_STRING='{
    \n\t"dialect":"'$d'",
    \n\t"database":"'$n'",
    \n\t"user":"'$u'",
    \n\t"password":"'$p'",
    \n\t"host":"'$h'",
    \n\t"port":"'$P'",
    \n\t"logging":'$l'
    \n}'
fi

# Create database TODO: make node script to do this with sequelize
if [ "$y" == "true" ]; then
    case $d in
        mysql|mariadb)
            if [ $P == "default" ]; then
                P="3306"
            fi
            output=$(sudo mysql -u $u -p$p -h $h -e "CREATE DATABASE IF NOT EXISTS $n" -P $P 2>&1 &&
            sudo mysql -u $u -p$p -h $h $n < $SQL_FILE -P $P 2>&1)
            message_db_creation "$output"
            ;;
        sqlite)
            output=$(sudo sqlite3 $s < ./database/create.sql 2>&1)
            message_db_creation "$output"
            ;;
        mssql)
            if [ $P == "default" ]; then
                P="1433"
            fi
            output=$(sudo sqlcmd -S $h,$P -U $u -P $p -q "CREATE DATABASE $n" 2>&1 && 
            sudo sqlcmd -S $h,$P -U $u -P $p -i $SQL_FILE 2>&1)
            message_db_creation "$output"
            ;;
        postgres)
            if [ $P == "default" ]; then
                P="5432"
            fi
            output=$(sudo psql -U $u -h $h -p $P -c "CREATE DATABASE $n" 2>&1 && 
            sudo psql -U $u -h $h -p $P -d $n -f $SQL_FILE 2>&1)
            message_db_creation "$output"
            ;;
        *)
            echo "Database dialect not supported"
            supported_dialects=(mysql mariadb sqlite mssql postgres)
            echo "Supported dialects: ${supported_dialects[@]}"
            usage 1
            exit 1
            ;;
    esac
fi

echo -e $JSON_STRING > config.json
output=$(node ./models 2>&1)

if [ $? -eq 0 ]; then
    echo "Database setup complete"
else
    echo "Database setup failed:"
    echo "$output"
    exit 1
fi
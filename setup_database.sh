#!/usr/bin/env bash

d=""
n="games"
u="root"
p=""
h="localhost"
P="default"
l="true"
s="./database/db.sqlite"
c="false"

usage() {
    usages=(
        "-d <database dialect>"
        "-n [database name {\"$n\"}]"
        "-u [database user {\"$u\"}]"
        "-p [database password {\"$p\"}]"
        "-h [database host {\"$h\"}]"
        "-P [database port {default for dialect}]"
        "-l [logging {\"$l\"}]"
        "-s [sqlite path {\"$s\"}]"
        "-H [help]"
        "-c [create database]"
    )
    echo -e "\nUsage: $0"
    for usage in "${usages[@]}"; do
        echo -e "\t$usage"
    done
    echo

    exit $1
}

SUPPORTED_DIALECTS=(mysql mariadb sqlite mssql postgres)

dialects_available() {
    echo "Supported dialects: ${SUPPORTED_DIALECTS[@]}"
    usage 1
    exit 1
}

dialect_supported() {
    for dialect in "${SUPPORTED_DIALECTS[@]}"; do
        if [[ "$dialect" == "$1" ]]; then
            return 0
        fi
    done
    return 1
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

set_default_port() {
    case "$1" in
        mysql|mariadb)
            P="3306"
            ;;
        sqlite)
            P=""
            ;;
        mssql)
            P="1433"
            ;;
        postgres)
            P="5432"
            ;;
        *)
            dialects_available
            ;;
    esac
}

SQL_FILE="./database/create.sql"


if [ "$#" -eq 0 ]; then
    usage 1
fi

while getopts ":d:n:u:ph:l:s:c" o; do
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
        c) #create database
            c="true"
            ;;
        :)
            if [[ $OPTARG != "d" ]]; then
                echo "Option -$OPTARG requires an argument." >&2
                usage 1
            fi
            ;;
        \?)
            echo "Unimplemented option: -$OPTARG" >&2
            usage 1
            ;;
        *)
            usage 1
            ;;
    esac
done

if ! dialect_supported "$d"; then
    echo "Dialect \"$d\" not supported"
    dialects_available
fi

set_default_port "$d"

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

echo -e $JSON_STRING > config.json
# Create database 
if [ "$c" == "true" ]; then
    echo "Trying to create database"
    output=$(node ./models sync 2>&1)
else 
    echo "Testing database connection..."
    output=$(node ./models 2>&1)
fi 

if [ $? -eq 0 ]; then
    echo "Database setup complete"
else
    echo "Database setup failed:"
    echo "$output"
    echo "Deleteing config.json"
    rm config.json
    exit 1
fi
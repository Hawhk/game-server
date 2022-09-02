#!/usr/bin/env bash
usage() {
    usages=(
        "-d <database>"
        "-n <database name>"
        "-u <database user>"
        "-p <database password>"
        "-h <database host>"
        "-p <database port>"
        "-l <logging true|false>"
        "-s <sqlite path>"
        "-H <help>"
    )
    echo -e "\nUsage: $0"
    for usage in "${usages[@]}"; do
        echo -e "\t$usage"
    done
    echo

    exit $1
}

d="sqlite"
n="games"
u="root"
p=""
h="localhost"
P="default"
l="true"
s="database/db.sqlite"
args=""

while getopts ":d:n:u:ph:l:y" o; do
    case "${o}" in
        d) #database/dialect
            databases=("mysql" "mariadb" "sqlite" "mssql" "postgres")
            for database in "${databases[@]}"; do
                if [ "${OPTARG}" == "$database" ]; then
                    d=${OPTARG}
                fi
            done
            if [ "$d" == "" ]; then
                echo "Database not availeble"
                usage 1
            fi
            ;;
        n) #database name
            n=${OPTARG}
            ;;
        u) #database user
            u=${OPTARG}
            ;;
        p) #database password 
            echo "Enter password: "
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
            args="sync"
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

echo -e $JSON_STRING > config.json
node ./models $args > /dev/null

if [ $? -eq 0 ]; then
    echo "Database setup complete"
else
    echo "Database setup failed"
    exit 1
fi
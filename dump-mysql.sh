#/bin/bash

read -p "Mysql Password: " mps

MYSQL_OPT="--user=root --host=127.0.0.1 --protocol=tcp --port=3306 -p${mps} --default-character-set=utf8"

mysql ${MYSQL_OPT} --skip-column-names -e"SELECT CONCAT(table_schema,'.',table_name) FROM information_schema.tables WHERE table_schema IN ('a297dfacd7a84eab9656675f61750078', '61a9ba99b94a4325ac747b4a9263df68')" > ListOfTables.txt

echo Wait...
rm -rf mysql-bak/*

echo "CREATE DATABASE IF NOT EXISTS a297dfacd7a84eab9656675f61750078;" >> mysql-bak/00_schemas.sql

echo "CREATE DATABASE IF NOT EXISTS 61a9ba99b94a4325ac747b4a9263df68;" >> mysql-bak/00_schemas.sql


for DBTB in `cat ListOfTables.txt`
do
    DB=`echo ${DBTB} | sed 's/\./ /g' | awk '{print $1}'`
    TB=`echo ${DBTB} | sed 's/\./ /g' | awk '{print $2}'`
    FN="mysql-bak/${DB}_${TB}.sql"
    echo DUMP:: ${DB} ${TB}
    echo USE \`${DB}\`\; > ${FN}
    mysqldump ${MYSQL_OPT} --hex-blob --triggers ${DB} ${TB} >> ${FN}
done

rm ListOfTables.txt
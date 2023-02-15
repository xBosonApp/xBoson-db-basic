#/bin/bash

read -p "Mysql Password: " mps

for fname in `ls mysql-bak/*.sql`
do
  echo Reading ${fname}
  mysql -uroot -p${mps} < mysql-bak/${fname}
done

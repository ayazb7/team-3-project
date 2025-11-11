#!/bin/bash
mysql -u root  skywise_db < db_creation.sql
mysql -u root  skywise_db < insert_digital_kickstart.sql
for f in ./*.sql; do
    if [[ "$f" == "./db_creation.sql" || "$f" == "./insert_digital_kickstart.sql" ]]; then
        continue
    fi


	echo "Sourcing $f"
	mysql -u root  skywise_db < "$f"
done

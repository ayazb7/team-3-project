#!/bin/bash
mysql -u root  skywise_db < db_creation.sql
for f in ./*.sql; do
    if [[ "$f" == "./db_creation.sql" || "$f" == "./insert_career_launch_course.sql" ]]; then
        continue
    fi


	echo "Sourcing $f"
	mysql -u root  skywise_db < "$f"
done

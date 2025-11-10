#!/bin/bash
for f in ./*.sql; do
	echo "Sourcing $f"
	mysql -u root  skywise_db < "$f"
done

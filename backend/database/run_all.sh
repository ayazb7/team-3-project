#!/bin/bash

# Initialize database schema
echo "Sourcing ./db_creation.sql"
mysql -u root skywise_db < db_creation.sql

# Run course inserts in correct order
echo "Sourcing ./insert_digital_kickstart_course.sql"
mysql -u root skywise_db < insert_digital_kickstart_course.sql

echo "Sourcing ./insert_teams_unlocked_course.sql"
mysql -u root skywise_db < insert_teams_unlocked_course.sql

echo "Sourcing ./insert_career_launch_course.sql"
mysql -u root skywise_db < insert_career_launch_course.sql

echo "Sourcing ./insert_smartphone_starter_course.sql"
mysql -u root skywise_db < insert_smartphone_starter_course.sql

echo "Sourcing ./insert_working_in_the_cloud_course.sql"
mysql -u root skywise_db < insert_working_in_the_cloud_course.sql

echo "Sourcing ./insert_everyday_computing_course.sql"
mysql -u root skywise_db < insert_everyday_computing_course.sql

echo "Sourcing ./insert_sample_users.sql"
mysql -u root skywise_db < insert_sample_users.sql

echo "Database initialization complete!"

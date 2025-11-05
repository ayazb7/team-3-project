# Course Insert Order

Due to prerequisite dependencies, run the course insert scripts in this order:

```bash
# 1. Base courses (no prerequisites)
mysql -u your_username -p skywise_db < insert_digital_kickstart_course.sql

# 2. Courses that depend on course 1
mysql -u your_username -p skywise_db < insert_career_launch_course.sql

# 3. Other independent courses (can be run in any order)
mysql -u your_username -p skywise_db < insert_smartphone_starter_course.sql
mysql -u your_username -p skywise_db < insert_everyday_computing_course.sql
mysql -u your_username -p skywise_db < insert_teams_unlocked_course.sql
mysql -u your_username -p skywise_db < insert_working_in_the_cloud_course.sql
```

## Course Dependencies

- **Digital Kickstart (id=1)** - No prerequisites
- **Career Launch (id=3)** - Requires Digital Kickstart (id=1)
- Other courses - No prerequisites (independent)

## Quick Fix

If you already ran `db_creation.sql`, just run:

```bash
cd backend/database
mysql -u your_username -p skywise_db < insert_digital_kickstart_course.sql
mysql -u your_username -p skywise_db < insert_career_launch_course.sql
```

This will resolve the foreign key constraint error!

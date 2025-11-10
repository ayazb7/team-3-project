# Docker Setup Checklist

Use this checklist to track your progress setting up the containerized application.

---

## 📋 Pre-Setup

- [ ] Docker Desktop installed
- [ ] Docker Desktop is running
- [ ] Verified Docker is working: `docker --version`
- [ ] Verified Docker Compose is working: `docker-compose --version`

---

## 🔧 Configuration

- [ ] Created `.env` file from template: `cp .env.docker.example .env`
- [ ] Set `MYSQL_ROOT_PASSWORD` to a secure password
- [ ] Set `MYSQL_PASSWORD` to a secure password
- [ ] Generated and set `JWT_SECRET_KEY`
- [ ] Verified database files exist:
  - [ ] `backend/database/db_creation.sql`
  - [ ] `backend/database/insert_goated_user.sql`

---

## 🏗️ Build & Start

- [ ] Built Docker images: `docker-compose build`
  - [ ] Backend build successful
  - [ ] Frontend build successful
  - [ ] MySQL image pulled
- [ ] Started all services: `docker-compose up -d`
- [ ] Waited 60 seconds for initialization

---

## ✅ Verification

- [ ] Checked container status: `docker-compose ps`
  - [ ] `skywise-db` shows "Up (healthy)"
  - [ ] `skywise-backend` shows "Up (healthy)"
  - [ ] `skywise-frontend` shows "Up (healthy)"

- [ ] Checked logs for errors:
  - [ ] Database logs: `docker-compose logs db`
  - [ ] Backend logs: `docker-compose logs backend`
  - [ ] Frontend logs: `docker-compose logs frontend`

- [ ] Tested database connection:
  - [ ] Connected to MySQL: `docker-compose exec db mysql -u root -p`
  - [ ] Verified database exists: `SHOW DATABASES;`
  - [ ] Verified tables created: `USE skywise_db; SHOW TABLES;`
  - [ ] Verified sample data exists: `SELECT * FROM users;`

- [ ] Tested backend API:
  - [ ] Health check works: `curl http://localhost:5000/health`
  - [ ] Response shows: `{"status":"healthy","service":"skywise-backend"}`

- [ ] Tested frontend:
  - [ ] Frontend loads in browser: `http://localhost`
  - [ ] Landing page displays correctly
  - [ ] No console errors in browser

---

## 🧪 Integration Testing

- [ ] Registered a new user through the frontend
- [ ] Logged in with new user
- [ ] Dashboard loads correctly
- [ ] Can view courses
- [ ] Can access tutorials
- [ ] Admin panel accessible (if admin user)
- [ ] Verified new user in database:
  ```bash
  docker-compose exec db mysql -u root -p skywise_db -e "SELECT * FROM users;"
  ```

---

## 📦 Production Readiness (Optional)

- [ ] Changed all default passwords
- [ ] Set up database backups
- [ ] Configured resource limits
- [ ] Set up monitoring
- [ ] Configured logging
- [ ] SSL/TLS certificates configured
- [ ] Firewall rules configured
- [ ] Tested disaster recovery

---

## 📚 Documentation Review

- [ ] Read `DOCKER_QUICK_START.md`
- [ ] Read `DOCKER_SETUP_GUIDE.md`
- [ ] Bookmarked troubleshooting section
- [ ] Understand how to view logs
- [ ] Understand how to restart services
- [ ] Know how to backup database

---

## 🎉 Success!

**If all items above are checked, your application is successfully containerized!**

### Quick Commands Reference:

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Rebuild
docker-compose build
docker-compose up -d
```

### Access Points:

- **Frontend:** http://localhost
- **Backend API:** http://localhost:5000
- **Database:** localhost:3306

---

**Need help?** See `DOCKER_SETUP_GUIDE.md` for detailed instructions and troubleshooting.

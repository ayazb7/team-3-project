# Docker Quick Start - TL;DR Version

Quick reference for setting up and running the containerized application.

---

## 🚀 First Time Setup (5 minutes)

```bash
# 1. Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop

# 2. Create environment file
cp .env.docker.example .env

# 3. Edit .env with your passwords
notepad .env  # Windows
nano .env     # Linux/Mac

# 4. Build and start everything
docker-compose up -d

# 5. Wait 60 seconds for initialization, then check status
docker-compose ps
```

**Access your application:**
- Frontend: http://localhost
- Backend API: http://localhost:5000
- Database: localhost:3306

---

## 📦 What Gets Containerized?

```
┌─────────────────────┐
│   FRONTEND          │  Port 80
│   (React + Nginx)   │  Serves web app
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   BACKEND           │  Port 5000
│   (Flask API)       │  Handles requests
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   DATABASE          │  Port 3306
│   (MySQL 8.0)       │  Stores data
└─────────────────────┘
```

---

## 🎯 Essential Commands

### Daily Usage

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Development

```bash
# Rebuild after code changes
docker-compose build backend
docker-compose up -d backend

# View specific service logs
docker-compose logs -f backend

# Restart a service
docker-compose restart backend
```

### Database

```bash
# Connect to MySQL
docker-compose exec db mysql -u root -p

# Backup database
docker-compose exec db mysqldump -u root -p skywise_db > backup.sql

# Restore database
docker-compose exec -T db mysql -u root -p skywise_db < backup.sql
```

### Troubleshooting

```bash
# Fresh start (⚠️ deletes data!)
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# View all logs
docker-compose logs

# Check resource usage
docker stats
```

---

## ⚙️ Environment Variables (.env file)

```env
# Required settings
MYSQL_ROOT_PASSWORD=your-secure-password
MYSQL_DB=skywise_db
MYSQL_USER=skywise
MYSQL_PASSWORD=your-secure-password
JWT_SECRET_KEY=your-long-random-secret-key
FLASK_ENV=production
```

**Generate JWT secret:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

---

## ✅ Verification Checklist

After running `docker-compose up -d`:

```bash
# 1. Check all containers are healthy (wait 60 seconds)
docker-compose ps
# All should show "Up (healthy)"

# 2. Test backend API
curl http://localhost:5000/health
# Should return: {"status":"healthy","service":"skywise-backend"}

# 3. Open frontend
# Browser: http://localhost
# Should load the SkyWise landing page

# 4. Test database
docker-compose exec db mysql -u root -p -e "SHOW DATABASES;"
# Should see 'skywise_db'
```

---

## 🐛 Common Issues & Fixes

| Issue | Quick Fix |
|-------|-----------|
| Port already in use | Change port in docker-compose.yml or stop conflicting service |
| Database not ready | Wait 60 seconds, check: `docker-compose logs db` |
| Backend can't connect to DB | Restart backend: `docker-compose restart backend` |
| Frontend shows 502 | Check backend is running: `docker-compose ps` |
| Permission denied | Linux/Mac: `sudo chown -R $USER:$USER .` |

---

## 📂 Important Files

```
project-root/
├── docker-compose.yml          # Orchestrates all services
├── .env                        # Your environment variables (create this!)
├── .env.docker.example         # Template for .env
├── backend/
│   ├── Dockerfile              # Backend container config
│   ├── .dockerignore           # Files to exclude from build
│   └── database/
│       ├── db_creation.sql     # Database schema
│       └── insert_goated_user.sql  # Sample data
└── frontend/
    ├── Dockerfile              # Frontend container config
    └── .dockerignore           # Files to exclude from build
```

---

## 🔄 Workflow

### Making Code Changes

**Backend changes:**
```bash
# Edit Python files
# Then rebuild:
docker-compose build backend
docker-compose up -d backend
docker-compose logs -f backend
```

**Frontend changes:**
```bash
# Edit React files
# Then rebuild:
docker-compose build frontend
docker-compose up -d frontend
```

**Database changes:**
```bash
# Edit .sql files
# Then reset database:
docker-compose down -v
docker-compose up -d
# Wait 60 seconds for initialization
```

---

## 📝 Notes

- **First startup:** Takes 30-60 seconds (database initialization)
- **Subsequent startups:** Takes 5-10 seconds
- **Data persistence:** Database data survives container restarts
- **Fresh start:** Use `docker-compose down -v` to wipe data

---

## 🎓 Learn More

- Full guide: `DOCKER_SETUP_GUIDE.md`
- Docker docs: `DOCKER.md`
- Docker Desktop: https://docs.docker.com/desktop/

---

**Need help?** Check `DOCKER_SETUP_GUIDE.md` for detailed troubleshooting!

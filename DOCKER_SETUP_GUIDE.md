# Complete Docker Setup Guide - SkyWise Application

This guide will walk you through containerizing your database, backend, and frontend using Docker.

---

## 📋 Prerequisites

Before starting, ensure you have:

### 1. Install Docker Desktop
- **Windows/Mac**: Download from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: Install Docker Engine and Docker Compose
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo apt-get install docker-compose-plugin
  ```

### 2. Verify Installation
```bash
docker --version
docker-compose --version
```

You should see version numbers (e.g., Docker version 24.x.x, Docker Compose version v2.x.x)

---

## 🚀 Step-by-Step Setup Process

### **Step 1: Prepare Environment Variables**

1. **Create the environment file:**
   ```bash
   # From the project root directory
   cp .env.docker.example .env
   ```

2. **Edit the `.env` file** with your values:
   ```bash
   # Open in your text editor
   notepad .env     # Windows
   nano .env        # Linux/Mac
   ```

3. **Set secure values:**
   ```env
   # MySQL Database Configuration
   MYSQL_ROOT_PASSWORD=your-secure-root-password-here
   MYSQL_DB=skywise_db
   MYSQL_USER=skywise
   MYSQL_PASSWORD=your-secure-database-password-here

   # JWT Secret (generate a random string)
   JWT_SECRET_KEY=your-very-long-random-secret-key-change-this

   # Flask Environment
   FLASK_ENV=production
   ```

   **⚠️ IMPORTANT:**
   - Use strong, unique passwords
   - Never commit `.env` file to Git
   - Generate a random JWT secret key

4. **Generate a secure JWT secret (optional):**
   ```bash
   # Python method
   python -c "import secrets; print(secrets.token_urlsafe(64))"

   # Or use online tool (not recommended for production)
   # https://randomkeygen.com/
   ```

---

### **Step 2: Verify Database Files**

Make sure your database initialization files exist:

```bash
# Check these files exist:
ls backend/database/db_creation.sql
ls backend/database/insert_goated_user.sql
```

These files will be automatically run when the MySQL container first starts.

---

### **Step 3: Build Docker Images**

Build all the Docker images:

```bash
# From the project root directory
docker-compose build
```

This will:
- ✅ Build the backend (Flask API) image
- ✅ Build the frontend (React + Nginx) image
- ✅ Pull the MySQL 8.0 image

**Expected output:** You should see build progress for frontend and backend.

**⏱️ Time:** First build takes 5-10 minutes depending on your internet speed.

---

### **Step 4: Start All Services**

Start all containers:

```bash
docker-compose up -d
```

The `-d` flag runs containers in detached mode (background).

This starts:
1. **MySQL Database** (port 3306)
2. **Backend API** (port 5000)
3. **Frontend** (port 80)

**⏱️ Time:** First startup takes 30-60 seconds (database initialization)

---

### **Step 5: Verify Containers Are Running**

Check the status of all containers:

```bash
docker-compose ps
```

**Expected output:**
```
NAME                 IMAGE              STATUS              PORTS
skywise-db           mysql:8.0          Up (healthy)        0.0.0.0:3306->3306/tcp
skywise-backend      backend            Up (healthy)        0.0.0.0:5000->5000/tcp
skywise-frontend     frontend           Up (healthy)        0.0.0.0:80->80/tcp
```

All services should show **"Up (healthy)"** status.

**If not healthy yet:** Wait 30-60 seconds for health checks to pass, especially for the database.

---

### **Step 6: Check Container Logs**

View logs to ensure everything is working:

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs db
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f backend
```

**What to look for:**
- **Database:** "ready for connections" message
- **Backend:** "Running on http://0.0.0.0:5000"
- **Frontend:** Nginx started successfully

---

### **Step 7: Test Database Connection**

Verify the database is initialized correctly:

```bash
# Connect to MySQL
docker-compose exec db mysql -u root -p
# Enter the password from your .env file (MYSQL_ROOT_PASSWORD)
```

Then run these SQL commands:
```sql
-- Check databases
SHOW DATABASES;

-- Use your database
USE skywise_db;

-- Check tables were created
SHOW TABLES;

-- Check if sample user exists
SELECT * FROM users;

-- Exit
EXIT;
```

---

### **Step 8: Test Backend API**

Test the backend API endpoints:

```bash
# Test health check
curl http://localhost:5000/health

# Expected output:
# {"service":"skywise-backend","status":"healthy"}
```

**Using browser:** Open http://localhost:5000/health

---

### **Step 9: Access Frontend Application**

Open your web browser and go to:

```
http://localhost
```

You should see the SkyWise landing page!

**Test login:**
- Use the credentials from your `insert_goated_user.sql` file
- Default user (if using the sample data)

---

### **Step 10: Test Full Integration**

1. **Register a new user** through the frontend
2. **Login** with the new account
3. **Navigate to dashboard** to verify API communication
4. **Check database** to see if user was created:
   ```bash
   docker-compose exec db mysql -u root -p skywise_db -e "SELECT * FROM users;"
   ```

---

## 🔧 Common Commands Reference

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Stop all services (keeps data)
docker-compose down

# Stop and remove volumes (⚠️ deletes database!)
docker-compose down -v

# Restart a specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart db
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Execute Commands in Containers

```bash
# Backend shell
docker-compose exec backend bash

# Frontend shell (nginx)
docker-compose exec frontend sh

# Database shell
docker-compose exec db mysql -u root -p

# Run Python commands in backend
docker-compose exec backend python -c "print('Hello')"
```

### Rebuild After Code Changes

```bash
# Rebuild specific service
docker-compose build backend
docker-compose up -d backend

# Rebuild all services
docker-compose build
docker-compose up -d
```

---

## 🐛 Troubleshooting

### Issue 1: Port Already in Use

**Error:** `Bind for 0.0.0.0:5000 failed: port is already allocated`

**Solution:**
```bash
# Find what's using the port (Windows)
netstat -ano | findstr :5000

# Find what's using the port (Mac/Linux)
lsof -i :5000

# Kill the process or change port in docker-compose.yml
```

### Issue 2: Database Connection Failed

**Error:** Backend can't connect to database

**Solution:**
```bash
# Check if database is healthy
docker-compose ps

# Check database logs
docker-compose logs db

# Wait longer - database initialization takes 30-60 seconds

# Restart backend after database is healthy
docker-compose restart backend
```

### Issue 3: Frontend Shows 502 Bad Gateway

**Error:** Nginx can't reach backend

**Solution:**
```bash
# Check if backend is running
docker-compose ps backend

# Check backend logs
docker-compose logs backend

# Restart services in order
docker-compose restart backend
docker-compose restart frontend
```

### Issue 4: Permission Denied Errors

**Solution:**
```bash
# Linux/Mac only - fix permissions
sudo chown -R $USER:$USER .
```

### Issue 5: Database Not Initializing

**Error:** Tables don't exist

**Solution:**
```bash
# Remove existing volume and recreate
docker-compose down -v
docker-compose up -d

# Wait for database initialization (check logs)
docker-compose logs -f db
```

---

## 🔄 Complete Fresh Start

If you want to start completely fresh:

```bash
# 1. Stop and remove everything
docker-compose down -v

# 2. Remove images (optional)
docker-compose down --rmi all

# 3. Rebuild
docker-compose build --no-cache

# 4. Start fresh
docker-compose up -d

# 5. Watch initialization
docker-compose logs -f
```

---

## 📊 Monitoring

### Check Resource Usage

```bash
# View CPU/Memory usage
docker stats

# View specific container
docker stats skywise-backend
```

### View Container Details

```bash
# Inspect container
docker inspect skywise-backend

# View networks
docker network ls

# View volumes
docker volume ls
```

---

## 🔐 Production Considerations

Before deploying to production:

### 1. Security
- ✅ Use strong, unique passwords
- ✅ Change all default credentials
- ✅ Use Docker secrets for sensitive data
- ✅ Enable SSL/TLS (HTTPS)
- ✅ Configure firewall rules

### 2. Performance
- ✅ Adjust resource limits in docker-compose.yml
- ✅ Configure database connection pooling
- ✅ Set up database backups
- ✅ Enable Nginx caching

### 3. Monitoring
- ✅ Set up logging aggregation
- ✅ Configure health check alerts
- ✅ Monitor container metrics
- ✅ Set up automated backups

---

## 💾 Database Backup & Restore

### Backup Database

```bash
# Create backup
docker-compose exec db mysqldump -u root -p skywise_db > backup-$(date +%Y%m%d).sql

# With password from env (careful with history!)
docker-compose exec db mysqldump -u root -p${MYSQL_ROOT_PASSWORD} skywise_db > backup.sql
```

### Restore Database

```bash
# Restore from backup
docker-compose exec -T db mysql -u root -p skywise_db < backup.sql
```

---

## 🎯 Next Steps

After successful setup:

1. **Test all features** through the frontend
2. **Verify admin panel** access
3. **Create test users** and courses
4. **Set up CI/CD** using the Jenkinsfile
5. **Deploy to production** server

---

## 📞 Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify containers are healthy: `docker-compose ps`
3. Review this troubleshooting guide
4. Check Docker documentation: https://docs.docker.com/

---

## ✅ Success Checklist

- [ ] Docker Desktop installed and running
- [ ] `.env` file created with secure passwords
- [ ] All containers built successfully
- [ ] All containers show "healthy" status
- [ ] Database initialized with tables
- [ ] Backend health check responds
- [ ] Frontend loads in browser
- [ ] Can register new user
- [ ] Can login and access dashboard
- [ ] Admin panel accessible (for admin users)

**Congratulations! 🎉 Your application is now fully containerized!**

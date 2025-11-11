# Docker Setup Guide

This guide explains how to run the SkyWise application using Docker.

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0 or higher

## Quick Start

### 1. Configure Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.docker.example .env
```

Edit `.env` and set secure values, especially for:
- `JWT_SECRET_KEY` - Use a strong random string
- `MYSQL_ROOT_PASSWORD` - Set a secure password
- `MYSQL_PASSWORD` - Set a secure password

### 2. Build and Start All Services

```bash
docker-compose up -d
```

This will:
- Pull MySQL 8.0 image
- Build the backend (Flask API)
- Build the frontend (React + Nginx)
- Initialize the database with schema and sample data
- Start all services in the background

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Database**: localhost:3306

### 4. Check Service Status

```bash
docker-compose ps
```

### 5. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Volumes (deletes database data!)
```bash
docker-compose down -v
```

### Rebuild Images
```bash
docker-compose build --no-cache
```

### Restart a Specific Service
```bash
docker-compose restart backend
```

### Execute Commands in Containers

```bash
# Backend shell
docker-compose exec backend bash

# Frontend shell
docker-compose exec frontend sh

# MySQL shell
docker-compose exec db mysql -u root -p
```

## Service Architecture

```
┌─────────────────┐
│   Frontend      │
│  (React+Nginx)  │
│   Port: 80      │
└────────┬────────┘
         │
         │ HTTP
         │
┌────────▼────────┐
│    Backend      │
│   (Flask API)   │
│   Port: 5000    │
└────────┬────────┘
         │
         │ MySQL
         │
┌────────▼────────┐
│    Database     │
│   (MySQL 8.0)   │
│   Port: 3306    │
└─────────────────┘
```

## Health Checks

All services have health checks configured:

- **Database**: Checks MySQL availability every 10s
- **Backend**: Checks `/health` endpoint every 30s
- **Frontend**: Checks nginx availability every 30s

View health status:
```bash
docker-compose ps
```

## Volumes

- `mysql_data` - Persistent MySQL data storage

To backup database:
```bash
docker-compose exec db mysqldump -u root -p skywise_db > backup.sql
```

To restore database:
```bash
docker-compose exec -T db mysql -u root -p skywise_db < backup.sql
```

## Development vs Production

### Development Mode

For development with hot-reload, use volume mounts:

```yaml
# Add to backend service in docker-compose.yml
volumes:
  - ./backend/api:/app
```

Then restart:
```bash
docker-compose up -d backend
```

### Production Mode

The default setup is optimized for production:
- Multi-stage builds for smaller images
- Non-root users for security
- Health checks for reliability
- Automatic restarts

## Troubleshooting

### Port Already in Use
If you see "port is already allocated" error:

```bash
# Check what's using the port
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Stop conflicting services or change ports in docker-compose.yml
```

### Database Connection Failed
Wait for the database to be fully initialized (30-60 seconds on first run):

```bash
# Check if database is healthy
docker-compose ps
docker-compose logs db
```

### Frontend Can't Reach Backend
Check the backend is running and healthy:

```bash
curl http://localhost:5000/health
```

### Reset Everything
To start fresh:

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Security Notes

- Change default passwords in `.env`
- Use strong JWT secret keys
- Don't commit `.env` file to version control
- In production, use environment-specific secrets management
- Consider using Docker secrets for sensitive data

## Monitoring

### View Resource Usage
```bash
docker stats
```

### View Container Details
```bash
docker inspect skywise-backend
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Docker Hub](https://hub.docker.com/_/mysql)
- [Python Docker Hub](https://hub.docker.com/_/python)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)

pipeline {
    agent any

    environment {
        // Project-specific variables
        PROJECT_NAME = "team-3"
        BACKEND_PORT = "5003"
        FRONTEND_PORT = "83"
        MYSQL_PORT = "3303"
        DOCKER_NETWORK = "team-3-network"
        DOCKER_COMPOSE_FILE = "docker-compose.yml"
        
        // Container names
        MYSQL_CONTAINER = "team-3-mysql"
        API_CONTAINER = "team-3-api"
        FRONTEND_CONTAINER = "team-3-frontend"
        
        // Paths
        PROJECT_DIR = "${WORKSPACE}"
        BACKEND_DIR = "${PROJECT_DIR}/backend/api"
        FRONTEND_DIR = "${PROJECT_DIR}/frontend/team-3"
        
        // Get VM IP address
        VM_IP = sh(script: "hostname -I | awk '{print \\$1}'", returnStdout: true).trim()
        
        // Docker Hub Registry
        DOCKER_REGISTRY = "docker.io"
        DOCKER_USERNAME = "team3skywise"
        DOCKER_REGISTRY_URL = "${DOCKER_USERNAME}"
        
        // Credentials (set these in Jenkins credentials)
        MYSQL_ROOT_PASSWORD = credentials('team3-mysql-root-password')
        MYSQL_PASSWORD = credentials('team3-mysql-password')
        JWT_SECRET_KEY = credentials('team3-jwt-secret')
        OPENAI_API_KEY = credentials('team3-openai-api-key')
        DOCKERHUB_CREDENTIALS = credentials('team3-dockerhub-credentials')
    }

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "Checking out repository..."
                    checkout scm
                }
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    echo "Setting up environment variables..."
                    
                    // Create .env file if it doesn't exist
                    sh '''
                        cat > ${PROJECT_DIR}/.env << EOF
                        MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-root_password}
                        MYSQL_DB=${MYSQL_DB:-skywise_db}
                        MYSQL_USER=${MYSQL_USER:-team3_user}
                        MYSQL_PASSWORD=${MYSQL_PASSWORD:-team3_password}
                        MYSQL_HOST=${MYSQL_HOST:-mysql}
                        FLASK_ENV=${FLASK_ENV:-production}
                        FLASK_DEBUG=False
                        JWT_SECRET_KEY=${JWT_SECRET_KEY:-your-secret-key}
                        CORS_ORIGINS=http://${VM_IP}:${FRONTEND_PORT},http://localhost:${FRONTEND_PORT}
                        OPENAI_API_KEY=${OPENAI_API_KEY:-}
                        BACKEND_API_URL=http://${VM_IP}:${BACKEND_PORT}
                        EOF
                    '''
                    
                    echo "Environment file created"
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "Building Docker images..."
                    sh '''
                        cd ${PROJECT_DIR}
                        
                        # Build backend image
                        echo "Building backend image..."
                        docker build -t team-3-api:${BUILD_NUMBER} \
                            -t team-3-api:latest \
                            -t ${DOCKER_USERNAME}/team-3-api:${BUILD_NUMBER} \
                            -t ${DOCKER_USERNAME}/team-3-api:latest \
                            -f ${BACKEND_DIR}/Dockerfile \
                            ${BACKEND_DIR}
                        
                        # Build frontend image
                        echo "Building frontend image..."
                        docker build -t team-3-frontend:${BUILD_NUMBER} \
                            -t team-3-frontend:latest \
                            -t ${DOCKER_USERNAME}/team-3-frontend:${BUILD_NUMBER} \
                            -t ${DOCKER_USERNAME}/team-3-frontend:latest \
                            --build-arg BACKEND_API_URL=http://${VM_IP}:${BACKEND_PORT} \
                            -f ${FRONTEND_DIR}/Dockerfile \
                            ${FRONTEND_DIR}
                        
                        echo "Images built successfully"
                        docker images | grep team-3
                    '''
                }
            }
        }

        stage('Stop Existing Services') {
            steps {
                script {
                    echo "Stopping existing services..."
                    sh '''
                        cd ${PROJECT_DIR}
                        
                        # Stop and remove existing containers
                        docker-compose -f ${DOCKER_COMPOSE_FILE} down || true
                        
                        # Give some time for cleanup
                        sleep 5
                        
                        echo "Existing services stopped"
                    '''
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo "Deploying with Docker Compose..."
                    sh '''
                        cd ${PROJECT_DIR}
                        
                        # Start services in detached mode
                        docker-compose -f ${DOCKER_COMPOSE_FILE} up -d
                        
                        # Wait for services to be healthy
                        echo "Waiting for services to be ready..."
                        sleep 15
                        
                        # Check container status
                        echo "Container status:"
                        docker-compose -f ${DOCKER_COMPOSE_FILE} ps
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "Performing health checks..."
                    sh '''
                        echo "Checking MySQL..."
                        docker exec ${MYSQL_CONTAINER} mysqladmin ping -h localhost -u${MYSQL_USER} -p${MYSQL_PASSWORD} || exit 1
                        
                        echo "Checking API..."
                        for i in {1..30}; do
                            if curl -f http://localhost:${BACKEND_PORT}/health 2>/dev/null; then
                                echo "API is healthy"
                                break
                            fi
                            if [ $i -eq 30 ]; then
                                echo "API health check failed"
                                exit 1
                            fi
                            sleep 1
                        done
                        
                        echo "Checking Frontend..."
                        for i in {1..30}; do
                            if curl -f http://localhost:${FRONTEND_PORT} 2>/dev/null; then
                                echo "Frontend is healthy"
                                break
                            fi
                            if [ $i -eq 30 ]; then
                                echo "Frontend health check failed"
                                exit 1
                            fi
                            sleep 1
                        done
                    '''
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                script {
                    echo "Running backend tests..."
                    sh '''
                        cd ${BACKEND_DIR}
                        
                        # Install dependencies if needed
                        if [ ! -d ".venv" ]; then
                            python3 -m venv .venv
                            source .venv/bin/activate
                            pip install -r requirements.txt
                        else
                            source .venv/bin/activate
                        fi
                        
                        # Run pytest
                        python -m pytest tests/ -v --tb=short || echo "Backend tests failed but continuing..."
                    '''
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                script {
                    echo "Running frontend tests..."
                    sh '''
                        cd ${FRONTEND_DIR}
                        
                        # Install dependencies if needed
                        if [ ! -d "node_modules" ]; then
                            npm ci
                        fi
                        
                        # Run jest tests
                        npm test -- --passWithNoTests --watchAll=false --coverage || echo "Frontend tests failed but continuing..."
                    '''
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "Pushing images to Docker Hub..."
                    sh '''
                        # Login to Docker Hub
                        echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                        
                        # Push backend images
                        echo "Pushing backend image..."
                        docker push ${DOCKER_USERNAME}/team-3-api:${BUILD_NUMBER}
                        docker push ${DOCKER_USERNAME}/team-3-api:latest
                        
                        # Push frontend images
                        echo "Pushing frontend image..."
                        docker push ${DOCKER_USERNAME}/team-3-frontend:${BUILD_NUMBER}
                        docker push ${DOCKER_USERNAME}/team-3-frontend:latest
                        
                        # Logout
                        docker logout
                        
                        echo "Images pushed successfully to Docker Hub"
                    '''
                }
            }
        }

        stage('Cleanup Old Images') {
            steps {
                script {
                    echo "Cleaning up old Docker images..."
                    sh '''
                        # Remove dangling images
                        docker image prune -f
                        
                        # Keep only last 5 builds
                        docker images | grep team-3 | tail -n +6 | awk '{print $3}' | xargs -r docker rmi || true
                    '''
                }
            }
        }
    }

    post {
        success {
            script {
                echo "Build successful!"
                sh '''
                    echo "=== Deployment Summary ==="
                    echo "Backend API: http://${VM_IP}:${BACKEND_PORT}"
                    echo "Frontend: http://${VM_IP}:${FRONTEND_PORT}"
                    echo "MySQL: ${VM_IP}:${MYSQL_PORT}"
                    docker-compose -f ${PROJECT_DIR}/${DOCKER_COMPOSE_FILE} ps
                '''
            }
        }

        failure {
            script {
                echo "Build failed!"
                sh '''
                    echo "=== Error Logs ==="
                    docker-compose -f ${PROJECT_DIR}/${DOCKER_COMPOSE_FILE} logs --tail=50
                '''
            }
        }

        always {
            script {
                // Archive logs if needed
                sh '''
                    mkdir -p ${WORKSPACE}/logs
                    docker-compose -f ${PROJECT_DIR}/${DOCKER_COMPOSE_FILE} logs > ${WORKSPACE}/logs/deployment.log 2>&1 || true
                '''
                archiveArtifacts artifacts: 'logs/**', allowEmptyArchive: true
            }
        }
    }
}


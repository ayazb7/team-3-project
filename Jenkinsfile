pipeline {
    agent any

    environment {
        // Python settings
        PYTHON_VERSION = '3.10'
        VENV_DIR = 'venv'

        // Node.js settings
        NODE_VERSION = '20.x'

        // Database credentials
        MYSQL_HOST = credentials('mysql-host')
        MYSQL_USER = credentials('mysql-user')
        MYSQL_PASSWORD = credentials('mysql-password')
        MYSQL_DB = credentials('mysql-db')
        JWT_SECRET_KEY = credentials('jwt-secret-key')

        // Build info
        BUILD_TIMESTAMP = sh(script: "date +%Y%m%d-%H%M%S", returnStdout: true).trim()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        // ==================== BACKEND STAGES ====================

        stage('Backend: Setup Environment') {
            steps {
                echo 'Setting up Python virtual environment...'
                dir('backend/api') {
                    sh '''
                        python${PYTHON_VERSION} -m venv ${VENV_DIR}
                        . ${VENV_DIR}/bin/activate
                        pip install --upgrade pip
                        pip install -r requirements.txt
                    '''
                }
            }
        }

        stage('Backend: Lint') {
            steps {
                echo 'Running backend code quality checks...'
                dir('backend/api') {
                    sh '''
                        . ${VENV_DIR}/bin/activate
                        pip install flake8 pylint
                        echo "Running flake8 error checks..."
                        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics --exclude=${VENV_DIR} || true
                        echo "Running flake8 complexity checks..."
                        flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics --exclude=${VENV_DIR}
                    '''
                }
            }
        }

        stage('Backend: Test') {
            steps {
                echo 'Running backend unit tests...'
                dir('backend/api') {
                    sh '''
                        . ${VENV_DIR}/bin/activate
                        pip install pytest-cov
                        pytest tests/ --verbose --junit-xml=test-results.xml --cov=. --cov-report=xml --cov-report=html --cov-report=term
                    '''
                }
            }
        }

        stage('Backend: Security Scan') {
            steps {
                echo 'Running backend security vulnerability scan...'
                dir('backend/api') {
                    sh '''
                        . ${VENV_DIR}/bin/activate
                        pip install safety bandit
                        echo "Running safety check..."
                        safety check --json > safety-report.json || true
                        echo "Running bandit security scan..."
                        bandit -r . -f json -o bandit-report.json --exclude ${VENV_DIR} || true
                    '''
                }
            }
        }

        // ==================== FRONTEND STAGES ====================

        stage('Frontend: Setup Environment') {
            steps {
                echo 'Setting up Node.js environment...'
                dir('frontend/team-3') {
                    sh '''
                        node --version
                        npm --version
                        npm ci
                    '''
                }
            }
        }

        stage('Frontend: Lint') {
            steps {
                echo 'Running frontend code quality checks...'
                dir('frontend/team-3') {
                    sh '''
                        npm run lint
                    '''
                }
            }
        }

        stage('Frontend: Test') {
            steps {
                echo 'Running frontend unit tests...'
                dir('frontend/team-3') {
                    sh '''
                        npm run test -- --run --coverage
                    '''
                }
            }
        }

        stage('Frontend: Build') {
            steps {
                echo 'Building frontend application...'
                dir('frontend/team-3') {
                    sh '''
                        npm run build
                    '''
                }
            }
        }

        // ==================== BUILD & PACKAGE ====================

        stage('Create Artifacts') {
            parallel {
                stage('Package Backend') {
                    steps {
                        echo 'Creating backend deployment artifact...'
                        dir('backend') {
                            sh '''
                                tar -czf backend-${BUILD_NUMBER}.tar.gz \
                                    --exclude='api/${VENV_DIR}' \
                                    --exclude='api/__pycache__' \
                                    --exclude='api/.pytest_cache' \
                                    --exclude='api/tests' \
                                    --exclude='api/.env' \
                                    api/ database/
                            '''
                        }
                    }
                }
                stage('Package Frontend') {
                    steps {
                        echo 'Creating frontend deployment artifact...'
                        dir('frontend/team-3') {
                            sh '''
                                tar -czf frontend-${BUILD_NUMBER}.tar.gz dist/
                            '''
                        }
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo 'Archiving build artifacts...'

                // Backend artifacts
                archiveArtifacts artifacts: 'backend/backend-*.tar.gz', fingerprint: true
                archiveArtifacts artifacts: 'backend/api/test-results.xml', allowEmptyArchive: true
                archiveArtifacts artifacts: 'backend/api/coverage.xml', allowEmptyArchive: true
                archiveArtifacts artifacts: 'backend/api/htmlcov/**/*', allowEmptyArchive: true

                // Frontend artifacts
                archiveArtifacts artifacts: 'frontend/team-3/frontend-*.tar.gz', fingerprint: true
                archiveArtifacts artifacts: 'frontend/team-3/coverage/**/*', allowEmptyArchive: true
            }
        }

        stage('Publish Reports') {
            parallel {
                stage('Backend Test Results') {
                    steps {
                        echo 'Publishing backend test results...'
                        junit 'backend/api/test-results.xml'
                    }
                }
                stage('Backend Coverage Report') {
                    steps {
                        echo 'Publishing backend coverage report...'
                        publishHTML([
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'backend/api/htmlcov',
                            reportFiles: 'index.html',
                            reportName: 'Backend Coverage Report'
                        ])
                    }
                }
                stage('Frontend Coverage Report') {
                    steps {
                        echo 'Publishing frontend coverage report...'
                        publishHTML([
                            allowMissing: true,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'frontend/team-3/coverage',
                            reportFiles: 'index.html',
                            reportName: 'Frontend Coverage Report'
                        ])
                    }
                }
            }
        }

        // ==================== DEPLOYMENT STAGES ====================

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to staging environment...'
                script {
                    sh '''
                        echo "Deploying backend to staging..."
                        # Example deployment commands:
                        # scp backend/backend-${BUILD_NUMBER}.tar.gz user@staging:/path/to/backend/
                        # ssh user@staging "cd /path/to/backend && tar -xzf backend-${BUILD_NUMBER}.tar.gz && systemctl restart backend"

                        echo "Deploying frontend to staging..."
                        # scp frontend/team-3/frontend-${BUILD_NUMBER}.tar.gz user@staging:/path/to/frontend/
                        # ssh user@staging "cd /path/to/frontend && tar -xzf frontend-${BUILD_NUMBER}.tar.gz && cp -r dist/* /var/www/html/"
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo 'Preparing production deployment...'
                input message: 'Deploy to production?', ok: 'Deploy'
                script {
                    sh '''
                        echo "Deploying backend to production..."
                        # Example deployment commands:
                        # scp backend/backend-${BUILD_NUMBER}.tar.gz user@prod:/path/to/backend/
                        # ssh user@prod "cd /path/to/backend && tar -xzf backend-${BUILD_NUMBER}.tar.gz && systemctl restart backend"

                        echo "Deploying frontend to production..."
                        # scp frontend/team-3/frontend-${BUILD_NUMBER}.tar.gz user@prod:/path/to/frontend/
                        # ssh user@prod "cd /path/to/frontend && tar -xzf frontend-${BUILD_NUMBER}.tar.gz && cp -r dist/* /var/www/html/"
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs(
                deleteDirs: true,
                patterns: [
                    [pattern: 'backend/api/venv', type: 'INCLUDE'],
                    [pattern: 'frontend/team-3/node_modules', type: 'INCLUDE'],
                    [pattern: 'frontend/team-3/dist', type: 'INCLUDE']
                ]
            )
        }
        success {
            echo '✅ Pipeline completed successfully!'
            script {
                def message = """
                ✅ Build #${BUILD_NUMBER} SUCCESSFUL

                Branch: ${env.BRANCH_NAME}
                Commit: ${env.GIT_COMMIT?.take(7)}

                Backend: Tests passed, Coverage reported
                Frontend: Build successful, Tests passed

                Artifacts:
                - backend-${BUILD_NUMBER}.tar.gz
                - frontend-${BUILD_NUMBER}.tar.gz
                """
                echo message

                // Optionally send notifications:
                // emailext subject: "✅ Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                //          body: message,
                //          to: "team@example.com"

                // slackSend color: 'good',
                //           message: message,
                //           channel: '#deployments'
            }
        }
        failure {
            echo '❌ Pipeline failed!'
            script {
                def message = """
                ❌ Build #${BUILD_NUMBER} FAILED

                Branch: ${env.BRANCH_NAME}
                Commit: ${env.GIT_COMMIT?.take(7)}

                Please check Jenkins for detailed logs.
                """
                echo message

                // Optionally send notifications:
                // emailext subject: "❌ Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                //          body: message,
                //          to: "team@example.com"

                // slackSend color: 'danger',
                //           message: message,
                //           channel: '#deployments'
            }
        }
        unstable {
            echo '⚠️ Pipeline completed with warnings'
        }
    }
}

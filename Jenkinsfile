pipeline {
    agent any

    environment {
        // Docker Hub credentials (set in Jenkins Credentials Manager)
        DOCKER_HUB_CREDENTIALS = 'dockerhub-repo'
        DOCKER_IMAGE_NAME = "mammarraza/newblog"
        DOCKER_IMAGE_TAG = "latest"

        // Kubernetes deployment files
        KUBERNETES_DEPLOYMENT_FILE = "k8s/newblog-deployment.yaml"
        KUBERNETES_SERVICE_FILE = "k8s/newblog-service.yaml"
        KUBERNETES_INGRESS_FILE = "k8s/newblog-ingress.yaml"

        // AWS and Kubeconfig credentials
        AWS_CREDENTIALS = "awsCredentialsId"  // AWS Credentials stored in Jenkins
        AWS_REGION = "us-east-1"
        KUBE_CONFIG_CREDENTIALS = "kubeConfigId"
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Clone the GitHub repository with credentials
                git url: 'https://github.com/MAmmarRaza/NodeJsProjectCMS.git',
                    credentialsId: 'github-id', // GitHub credentials stored in Jenkins
                    branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image for ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"

                    // Build the Docker image from the cloned repository
                    sh "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    // Log in to Docker Hub
                    withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CREDENTIALS, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin"

                        // Tag the image and push to Docker Hub
                        sh "docker tag ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                        sh "docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                script {
                    // Use AWS credentials for EKS interaction
                    withAWS(credentials: AWS_CREDENTIALS, region: AWS_REGION) {
                        // Use Jenkins kubeconfig credentials to interact with Kubernetes
                        withKubeConfig([credentialsId: KUBE_CONFIG_CREDENTIALS]) {
                            echo 'Deploying to Kubernetes EKS Cluster...'

                            // Apply the Kubernetes manifests using kubectl
                            sh "kubectl apply -f ${KUBERNETES_DEPLOYMENT_FILE}"
                            sh "kubectl apply -f ${KUBERNETES_SERVICE_FILE}"
                            sh "kubectl apply -f ${KUBERNETES_INGRESS_FILE}"
                        }
                    }
                }
            }
        }

        stage('Check Deployment Status') {
            steps {
                script {
                    // Check if the deployment pods are running successfully
                    echo 'Checking the status of the deployment...'
                    sh "kubectl rollout status deployment/newblog-deployment"
                }
            }
        }
    }

    post {
        always {
            // Clean up the workspace after the pipeline run
            cleanWs()
        }

        success {
            echo 'Pipeline execution completed successfully!'
        }

        failure {
            echo 'Pipeline execution failed.'
        }
    }
}

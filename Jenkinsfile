def gv
pipeline {
    agent any
    stages {
        stage('init'){
            steps {
                script {
                    echo 'Initialising...'
                    gv = load 'script.groovy'
                }
            }
        }
        stage('Build Image') {
            steps {
               script {
                    gv.buildImage()
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
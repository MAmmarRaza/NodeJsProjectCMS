def buildImage(){
    echo 'Building image...'
    withCredentials([usernamePassword(credentialsId:'dockerhub-repo',passwordVariable:'PASS',usernameVariable:'USER')]) {
        sh 'docker build -t mammarraza/newblog:3.0 .'
        sh 'echo $PASS | docker login -u $USER --password-stdin'
        sh 'docker push mammarraza/newblog:3.0'
    }
}

return this
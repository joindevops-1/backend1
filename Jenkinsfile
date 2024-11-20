pipeline {
    agent {
        label 'AGENT-1'
    }

    options {
        timeout(time: 10, unit: 'MINUTES') 
        disableConcurrentBuilds()
    }

    environment { 
        appVersion = ''
        account_id = '315069654700'
    }

    //  parameters {
    //     string(name: 'PERSON', defaultValue: 'Mr Jenkins', description: 'Who should I say hello to?')

    //     text(name: 'BIOGRAPHY', defaultValue: '', description: 'Enter some information about the person')

    //     booleanParam(name: 'TOGGLE', defaultValue: true, description: 'Toggle this value')

    //     choice(name: 'CHOICE', choices: ['One', 'Two', 'Three'], description: 'Pick something')

    //     password(name: 'PASSWORD', defaultValue: 'SECRET', description: 'Enter a password')
    // }
    
    stages {
        stage('Read Version') {
            steps {
                script{
                    def packageJson = readJSON file: 'package.json'
                    appVersion = packageJson.version
                    echo "application version: $appVersion"
                }
            }
        }
         stage('Install Dependencies') {
            steps {
               sh """
                npm install
                ls -ltr
                echo "application version: $appVersion"
               """
            }
        }
        stage('Build'){
            steps{
                sh """
                zip -q -r backend-${appVersion}.zip * -x Jenkinsfile -x backend-${appVersion}.zip
                ls -ltr
                """
            }
        }
        stage('Docker build'){
            
                steps{
                withAWS(credentials: 'aws-creds', region: 'us-east-1') {
                    sh """
                        aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${account_id}.dkr.ecr.${region}.amazonaws.com

                        docker build -t ${account_id}.dkr.ecr.${region}.amazonaws.com/expense-backend:${appVersion} .

                        docker push ${account_id}.dkr.ecr.${region}.amazonaws.com/expense-backend:${appVersion}
                    """
                }
            }
        }
        stage('Test') {
            steps {
                sh 'echo This is Test'
            }
        }
        stage('Deploy') {
            steps {
                sh 'echo This is Deploy'
            }
        }
        stage("print params"){
            when {
                not {
                    branch 'main'
                }
                environment name: 'DEPLOY_TO', value: 'non-production'
            }
            steps{
                sh 'echo This is Deploy'  
            }
        }
        stage('Example') {
            steps {
                echo "Hello ${params.PERSON}"

                echo "Biography: ${params.BIOGRAPHY}"

                echo "Toggle: ${params.TOGGLE}"

                echo "Choice: ${params.CHOICE}"

                echo "Password: ${params.PASSWORD}"
            }
        }
        stage('Example Input') {
            input {
                message "Should we continue?"
                ok "Yes, we should."
                submitter "alice,bob"
                parameters {
                    string(name: 'PERSON', defaultValue: 'Mr Jenkins', description: 'Who should I say hello to?')
                }
            }
            steps {
                echo "Hello, ${PERSON}, nice to meet you."
            }
        }
    }
    post { 
        always { 
            echo 'I will always say Hello again!'
        }
        success { 
            echo 'I will run when pipeline is success'
        }
        failure { 
            echo 'I will run when pipeline is failure'
        }
    }
}
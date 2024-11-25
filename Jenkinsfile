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
        region = 'us-east-1'
        environment = 'dev'
        project = 'expense'
        component = 'backend'
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

                        docker build -t ${account_id}.dkr.ecr.${region}.amazonaws.com/expense/${environment}/backend:${appVersion} .

                        docker push ${account_id}.dkr.ecr.${region}.amazonaws.com/expense/${environment}/backend:${appVersion}
                    """
                }
            }
        }
        stage('Deploy'){
            steps{
                withAWS(credentials: 'aws-creds', region: 'us-east-1') {
                script{
                    releaseExists = sh(script: "helm list -A --short | grep -w ${component} || true", returnStdout: true).trim()
                        if(releaseExists.isEmpty()){
                            echo "${component} not installed yet, first time installation"
                            sh"""
                                aws eks update-kubeconfig --region ${region} --name ${project}-dev
                               
                                cd helm
                                sed -i 's/IMAGE_VERSION/${appVersion}/g' values.yaml
                                helm install ${component} -n ${project} .
                            """
                        }
                        else{
                            echo "${component} exists, running upgrade"
                            sh"""
                                aws eks update-kubeconfig --region ${region} --name ${project}-dev
                                cd helm
                                sed -i 's/IMAGE_VERSION/${appVersion}/g' values-${environment}.yaml
                                helm upgrade ${component} -n ${project} -f values-${environment}.yaml.
                            """
                        }
                }
                }
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
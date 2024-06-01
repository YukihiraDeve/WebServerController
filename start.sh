#!/bin/bash

REQUIRED_JAVA_VERSION="18"
REQUIRED_NODE_VERSION="16"

check_java_version() {
    local java_version
    java_version=$(java -version 2>&1 | awk -F[\"_] 'NR==1 {print $2}')
    if [[ "$java_version" == "$REQUIRED_JAVA_VERSION"* ]]; then
        return 0
    else
        return 1
    fi
}

check_node_version() {
    local node_version
    node_version=$(node -v 2>&1 | awk -F[v] '{print $2}')
    if [[ "$node_version" == "$REQUIRED_NODE_VERSION"* ]]; then
        return 0
    else
        return 1
    fi
}

if type -p java; then
    echo "Java est installé."
    if check_java_version; then
        echo "Java version $REQUIRED_JAVA_VERSION est déjà installée."
    else
        echo "La version de Java installée n'est pas la version $REQUIRED_JAVA_VERSION. Installation de la version $REQUIRED_JAVA_VERSION en cours..."
        INSTALL_JAVA=true
    fi
else
    echo "Java n'est pas installé. Installation de la version $REQUIRED_JAVA_VERSION en cours..."
    INSTALL_JAVA=true
fi

if [ "$INSTALL_JAVA" = true ]; then
    if [ "$(uname)" == "Darwin" ]; then
        # MacOS
        brew install openjdk@$REQUIRED_JAVA_VERSION
        sudo ln -sfn $(brew --prefix openjdk@$REQUIRED_JAVA_VERSION)/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk
        echo 'export PATH="/usr/local/opt/openjdk@$REQUIRED_JAVA_VERSION/bin:$PATH"' >> ~/.zshrc
        source ~/.zshrc
    elif [ -f /etc/debian_version ]; then
        # Debian/Ubuntu
        sudo apt update
        sudo apt install -y openjdk-$REQUIRED_JAVA_VERSION-jdk
    elif [ -f /etc/redhat-release ]; then
        # RHEL/CentOS
        sudo yum install -y java-$REQUIRED_JAVA_VERSION-openjdk
    elif [ -f /etc/arch-release ]; then
        # Arch Linux
        sudo pacman -S --noconfirm jdk-openjdk
    else
        echo "Système d'exploitation non supporté pour l'installation automatique de Java."
        exit 1
    fi
fi


if type -p node; then
    echo "Node.js est installé."
    if check_node_version; then
        echo "Node.js version $REQUIRED_NODE_VERSION est déjà installée."
    else
        echo "La version de Node.js installée n'est pas la version $REQUIRED_NODE_VERSION. Installation de la version $REQUIRED_NODE_VERSION en cours..."
        INSTALL_NODE=true
    fi
else
    echo "Node.js n'est pas installé. Installation de la version $REQUIRED_NODE_VERSION en cours..."
    INSTALL_NODE=true
fi

if [ "$INSTALL_NODE" = true ]; then
    if [ "$(uname)" == "Darwin" ]; then
        # MacOS
        brew install node@$REQUIRED_NODE_VERSION
        echo 'export PATH="/usr/local/opt/node@$REQUIRED_NODE_VERSION/bin:$PATH"' >> ~/.zshrc
        source ~/.zshrc
    elif [ -f /etc/debian_version ]; then
        # Debian/Ubuntu
        sudo apt update
        sudo apt install -y nodejs npm
        sudo npm install -g n
        sudo n $REQUIRED_NODE_VERSION
    elif [ -f /etc/redhat-release ]; then
        # RHEL/CentOS
        curl -fsSL https://rpm.nodesource.com/setup_$REQUIRED_NODE_VERSION.x | sudo bash -
        sudo yum install -y nodejs
    elif [ -f /etc/arch-release ]; then
        # Arch Linux
        sudo pacman -S --noconfirm nodejs npm
    else
        echo "Système d'exploitation non supporté pour l'installation automatique de Node.js."
        exit 1
    fi
fi


echo "API_SECRET_KEY=test" > Backend/.env
mkdir /servers/
chmod -R 777 Backend/scripts/*.sh

cd Backend
npm install

node app.js

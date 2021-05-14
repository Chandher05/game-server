## Deployment steps

#### Step 1: Install node, npm and pm2 
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04 

> sudo apt update
> 
> sudo apt install nodejs
> 
> sudo apt install npm
> 
> cd ~
> 
> curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
> 
> sudo bash nodesource_setup.sh
> 
> sudo apt install nodejs
> 
> sudo npm install pm2@latest -g


  #### Step 2: Clone project

> git clone https://github.com/jayasurya17/game-server

  
#### Step 3: Change backend URL in frontend

> vim game-server/frontend/src/constants/connection.js

Modify URL to instance IP (http://xxx.xxx.xxx.xxx)

#### Step 4: Add .env in backend and socket

> vim game-server/backend/.env
> vim game-server/socket/.env

  
File contents (Google keep - Game .env file)


#### Step 5: Add .env in frontend to run on port 8080

File content
> PORT=8080

#### Step 6: Install apache

https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-20-04

> sudo apt update
> 
> sudo apt install apache2
> 
> sudo ufw app list
> 
> sudo ufw allow 'Apache'
> 
> sudo ufw status
> 
> sudo
>
> systemctl status apache2

(status should show active)

  
#### Step 7: Update proxy for port 80 (to 8080). Frontend should run as default without any ports

https://stackoverflow.com/questions/8541182/apache-redirect-to-another-port

File is available in /etc/apache2/sites-enabled/000-default.conf

  

> <VirtualHost  *:80>
> 
> ProxyPreserveHost On
> 
> ProxyRequests Off
> 
> ProxyPass / http://localhost:8080/
> 
> ProxyPassReverse / http://localhost:8080/
> 
> \</VirtualHost>

Restart apache
> sudo a2enmod proxy && sudo a2enmod proxy_http && sudo service apache2 restart

  
  

#### Step 8: Install dependencies and start instances

> cd game-server/frontend/
> 
> npm i
> 
> pm2 --name frontend start npm -- start


> cd ../backend/
> 
> npm i
> 
> pm2 start index.js --name backend


> cd ../socket/
> 
> npm i
> 
> pm2 start index.js --name socket

#### Step 9: Check logs and status
> pm2 logs
> pm2 list

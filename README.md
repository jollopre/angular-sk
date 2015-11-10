# angular-sk

*angular-sk* is a repository containing the minimum dependencies to have an angularJS app up and running. This repository assumes you have installed node.js in your computer.

Following there are a set of useful commands needed to have your angular app ready (type them on the root folder where package.json is placed):

* npm install [--production]	(--production will install dependencies to run an angularJS app ONLY)

* npm run start-server (server will start listening at  http://localhost:3000/app/index.html). Note this command is not needed if you have already a server hosting this app.

* npm run e2e-test (will start selenium server and after will execute the e2e tests).

If you want to run specific scripts type:
	npm run <script_name> (available scripts are under scripts key inside of package.json file). 

# Blue Todo App

Welcome to my Blue Todo Web Application. This is a simple todo application which enables you to see all your pending tasks, create new tasks, update and delete tasks. It has a very simple user interface with a lot of focus on the user experience so that everyone can easily start using it (Since you're normally supposed to spend more time doing your actual tasks rather than interacting with a todo app hahahaha)

## Application architecture

The backend (API) is build with Node.js and the frontend with React.js. I used a single codebase for both backend and frontend so all the code is in the same GitHub repo. The Node.js app exposes API endpoints for performing CRUD (create, read, update & delete) actions on the todo tasks which are stored using a MySQL database. React.js powers the UI from which the user can interact with the app, it shows the tasks from the database and enables creating, updating & deleting tasks by sending requests to the API endpoints when needed. All backend code is in the "backend" folder while frontend code is in the "client" folder.

While developing, since the backend and frontend need different dev tools, I splitted them into two separate services. Used Vite to manage the React app and Nodemon to manage the backend. Other services include:
- A Proxy (Traefik) to route requests depending on the service being requested. This service acts like the entry point for the application so I exposed it's port 80 so it can be accessed from outside the container.
- A MySQL service which provides the database used to store the todo tasks
- PhpMyAdmin service which provides a UI to access & manage the MySQL database. This service will be accessible through port 3000 on the browser.

I used Docker containers to set everything up. The entire application is in a container called blue-todo-app.

## Development

Create a .env file in the project's base directory (The folder containing the compose.yml file), copy the contents of .env.example and paste into the .env file. The .env file is where we set all the environment varibales to be used by Docker. I can't push it to GitHub as it contents sensitive information and is bad practice. Edith the .env file according to your needs. Make sure to provide values for DB_USERNAME & DB_PASSWORD (I added a comment in the .env.example file to guide you) which will be used to create the DB user.

To spin up the project, make sure you have Docker Desktop installed and an Internet connection, then run the following commands:

```
git clone https://github.com/typedef24/Blue-todo-app.git
cd Blue-todo-app
docker compose up -d (Or docker compose watch)
```

This will download the container images from Docker Hub and after a
moment, the application will be up and running! You don't have to install or configure
anything on your machine, Docker create a virtual environment (container) and installs all the JS packages needed by the application

Simply open to [http://localhost:80](http://localhost:80) to see the app up and running!

Any changes made to either the backend or frontend should be seen immediately
without needing to rebuild or restart the containers because I configured the backend & client services to watch for any changes in the code. You only rebuild or restart the containers after making changes to the Dockerfile, Docker compose and .env file. 

Go to [http://localhost:3000](http://localhost:3000) to access PhpMyAmin and interact wih the MySQL database. You'll automatically be logged into PhpMyAdmin.

### Tearing it down

When you're done, simply remove the containers by running the following command:

```
docker compose down
```

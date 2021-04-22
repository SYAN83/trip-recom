![Logo of the project](./public/favicon.ico)

# TRIP RECOMMENDATION

This project uses historical Uber Movement data to recommend trips in Seattle area.

## Project Structure:

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- The server side is a REST API built with [FlaskAPI](https://flask-api.github.io/flask-api/). We currently uses a static file to simulate speed inference, which will be replaced with a ML model.

## Getting Started:

Depending on what's available in your computer, you may choose one of the following two ways to run the app.

1. npm

  - Prerequisites: using `npm` requires Node.js to be installed on your machine

    - [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
    - Run `install.sh` to create a Python virtual envirement for the REST API.

  - Run the App with npm:
    - From your project directory, type `npm start` to start the app in development mode, open another terminal and type `npm run start-api` to start the server API.

  - Stop the App:
    - Press `Ctrl`+`C` in both terminals will stop the client app and the server api.

2. Docker Compose

  - Prerequisites: you need to have docker and docker compose running on your machine.
    - [Install Docker Compose](https://docs.docker.com/compose/install/)
    - In `package.json`, replace `"proxy": "http://localhost:5000"` with `"proxy": "http://server:5000"`.

  - Re-build and run the app with Compose:
    - From your project directory, type `docker-compose up` to build the app with the updated Compose file, and run it.
    - You can bring everything down, removing the containers entirely, with the `docker-compose down` command.
    - (Optional) If you want to run your services in the background, you can pass the `-d` flag (for “detached” mode) to `docker-compose up` and use `docker-compose ps` to see what is currently running:
    ```
    $ docker-compose up -d
    $ docker-compose ps
    $ docker-compose stop
    ```
   

Once the app is started, open [http://localhost:3000](http://localhost:3000) to view it in the browser.

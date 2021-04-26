![Logo of the project](./public/favicon.ico)

# TRIP RECOMMENDATION

This project uses historical Uber Movement data to recommend trip routes in Seattle area.

## Project Structure:

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- The server side is a REST API built with [FlaskAPI](https://flask-api.github.io/flask-api/). We currently uses a static file to simulate speed inference, which will be replaced with a ML model.

## Getting Started:

Depending on what's available in your computer, you may choose one of the following two ways to run the app. Once the app is up, open [http://localhost:3000](http://localhost:3000) to view it in the browser.


### npm

  - Prerequisites: using `npm` requires Node.js to be installed on your machine

    - [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
    - Run `install.sh` to create a Python virtual envirement for the REST API.

  - Run the App with npm:
    - From your project directory, type `npm install` to install the dependencies and then type `npm start`, the app will then start in development mode.
    - Open another terminal from the project directory and type `npm run start-api` to start the server API.

  - Stop the App:
    - Press `Ctrl`+`C` in both terminals will stop the client app and the server api.

### Docker Compose

  - Prerequisites: you need to have docker and docker compose running on your machine.
    - [Install Docker Compose](https://docs.docker.com/compose/install/)
    - In `package.json`, replace `"proxy": "http://localhost:5000"` with `"proxy": "http://server:5000"`.

  - Run the app with Compose:
    - From your project directory, type `docker-compose up` to build the app with the updated Compose file, and run it.
    - (Optional) If you want to run your services in the background, you can pass the `-d` flag (for “detached” mode) to `docker-compose up` and use `docker-compose ps` to see what is currently running:
    ```
    $ docker-compose up -d
    Creating network "trip-recom_backend" with the default driver
    Creating client ... done
    Creating server ... done
    $ docker-compose ps
         Name               Command               State           Ports         
    ------------------------------------------------------------------------
    client   docker-entrypoint.sh npm start   Up      0.0.0.0:3000->3000/tcp
    server   python3 -m flask run --hos ...   Up      0.0.0.0:5000->5000/tcp
    $ docker-compose stop
    ```
  - Stop the App and remove the containers:
    - You can bring everything down, removing the containers entirely, with the `docker-compose down` command.
   


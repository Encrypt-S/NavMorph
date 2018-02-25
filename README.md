# Polymorph

A site for anonymizing crypto currencies via Changelly's crypto exchange system and NavTech's anonymous NavCoin transactions.

## Requirements

This project uses nodejs v8.9.0 and Mongodb.


# Development Setup
The development flow requires both a backend and frontend docker service to be running.

Please follow the steps below to get the docker version running on your system.

Note: You need to have docker installed.

## Shortcuts
`npm run start:server`
`npm run start:client`

**First run or when rebuild requires**
`npm run docker:server:build`
`npm run docker:build:build`

## Backend
The backend is a node / express app + mongo system.

Build and run the docker container.

`docker-compose -f docker-compose-prod.yml -f docker-compose-dev.yml up`

You can also force build the docker with.

`docker-compose -f docker-compose-prod.yml -f docker-compose-dev.yml up --build`


## Frontend
The frontend of NavMorph is an angular app. The dev enviroment is provided by docker.

Docker is not a requirement, but it is the fastest way to get going.

The docker environment for this build is a cmd line interface. This allows you to install packages, use the ng cli generator and run the app as you would with any other angular dev setup.
Build the docker image with the following command

`docker build -f dev.Dockerfile -t navmorph-frontend .`

Run the Docker container you just built

Windows: `docker run -it -p 4200:4200 -v ${pwd}:/app navmorph-frontend`
Mac: `docker run -it -p 4200:4200 -v "$(pwd)":/app navmorph-frontend`

### First run
As this is a dev env you need to run the dev-setup.sh

From docker container bash run `dev-setup.sh`

### Server the

For you convince we have a run and serve script.

`dev-start.sh`


## Code scaffolding

We use angular cli for creating new components.
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Run the project

Run `ng build-run` for a dev server. Navigate to `http://localhost:3000/`.
To rebuild the angular without starting a server, run `ng build`.
To skip rebuilding the angular, run `npm run express`

## Running unit tests

For angular tests, run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
For testing express run `npm run express-test`
For code coverage reports, run `npm run test-coverage` or `npm run express-coverage` for the front end and backend.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

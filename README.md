# Overview
This is simple CRUD application with Posts and Comments, based on Angular 2/4, Bootstrap4 and Neo4j database.

## Setup
* run `npm i`

## Run application
To check whole application (with web + server + neo4j) by one command, use:
* run `make application`
* then open `http://localhost:8080`

## For development needs
Supported with nodemon watch for backend and ng serve watch 
* run `make server` (server side with neo4j)
* in separate instance run `npm start` (client side)
* then open `http://localhost:8080`

## Neo4j
* you can separatelly run `docker-compose up neo4j`
* open `http://localhost:7474` to play with Neo4j console 

## Client
* open `http://localhost:8080`

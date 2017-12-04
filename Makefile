build:
	docker-compose build

stop:
	docker-compose stop


neo4j:
	docker-compose up neo4j

neo4j.console:
	docker-compose exec neo4j bash


server:
	docker-compose up app

server.console:
	docker-compose exec app bash


application:
	docker-compose up web

application.console:
	docker-compose exec web bash


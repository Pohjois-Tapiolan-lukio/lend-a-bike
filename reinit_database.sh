#!/bin/bash

docker-compose stop database
docker-compose rm -fv database
rm -rf data

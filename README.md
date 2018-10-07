# Lend-a-Bike

This is a server for lending bikes using docker and docker-compose.

### Usage & Requirements

You need

- nodejs (npm)
- docker
- docker-compose

Change the primary group of your user

- `sudo usermod -aG docker <USER>`
- `newgrp docker`

> You can also just run the server as root without needing
> to add the group

Initialize and update the submodule
[https://github.com/vishnubob/wait-for-it](wait-for)

- `git submodule init`
- `git submodule update`

Create secure keys and save them to the `secrets.env` file

To load up the server

- Go to the `api` folder and run `npm i`
- Go to the project's root and build the docker images
  `docker-compose build`
- Start the server with the secure keys
  `sh -ac '. ./secrets.env; docker-compose up'`

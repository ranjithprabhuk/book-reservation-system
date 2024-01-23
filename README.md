# Online Book Reservation
## Tech
- Node JS
- Nest JS
- Typeorm
- mysql
- Angular
- Bootstrap

## Installation

Dillinger requires [Node.js](https://nodejs.org/) v18+ to run.

### Backend
Update the following environment variables in the .env file inside the backend folder (You can refer docker compose file to add it)

```sh
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=
DB_PASSWORD=  
```
Install the dependencies and devDependencies and start the server.

```sh
cd backend
docker-compose up -d
yarn
yarn run start
```
It will be served from following URL.
```
http://localhost:3000/      -> Backend API
http://:localhost:3000/api   -> Swagger API Documentation
```

User Seed data and Book Seed data can be loaded into the db with the below 2 methods in swagger
```
http://localhost:3000/api#/Book%20Management/BookController_loadBookData    -> to seed user information
http://localhost:3000/api#/User%20Management/UserController_loadUserData    -> to seed book information
```
### Frontend
Install the dependencies and devDependencies and start the application.

```sh
cd frontend
yarn
yarn run start
```
It will be served from following URL.
```
http://localhost:4200/
```

## License

MIT

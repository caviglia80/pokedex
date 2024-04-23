# HW Nest Project: Nest + Docker + MongoDB

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

cheatSheet: [Nest-cheatsheet.pdf](Nest-cheatsheet.pdf)

1. Dependences installation
```
> npm i
> npm i -g @nestjs/cli // if not current installed
```
2. [docker-compose.yaml](docker-compose.yaml)
3. Taking the docker file and then install
```
> docker-compose up -d 
```
4. DB conection (table plus): 
```
URL: mongodb://localhost:27017/nest-pokemon
```
5. Install mongo connection dependences
```
> npm i @nestjs/mongoose mongoose
```
6. Import mongoose in @Module
```
MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon')
```
7. Add to .gitignore
```
/mongo
.env
```
8. To use .env
```
> npm i @nestjs/config
```

## Stack
* MongoDB
* Nest

## Notes:
* Validators
```
> npm i class-validator class-transformer
```

## Endpoints
* Seed
```
http://localhost:3000/api/v2/seed
```

## Use
* Levantar BD
```
> docker-compose up -d 
> docker-compose up --build // este solo si hago algun cambio en codigo o configuraciones
```
* BUILD
```
> docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build    // construir
> docker-compose -f docker-compose.prod.yaml up --build // o este
```
* Run (si se construyo una vez y tengo las imagenes, solo debo ejecutar este comando)
```
> docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```

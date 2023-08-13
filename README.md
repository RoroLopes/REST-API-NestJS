## Description

API REST en NestJS pour la gestion des utilisateurs et des groupes

## Prérequis

- [Node.js](https://nodejs.org/en/) >= 14.15.4
- [pnpm](https://pnpm.io/) >= 6.14.7
- [MySQL](https://www.mysql.com/fr/) >= 8.0.23
- [Docker](https://www.docker.com/) >= 20.10.2
- [Docker Compose](https://docs.docker.com/compose/) >= 1.27.4
- [NestJS](https://nestjs.com/) >= 7.5.1
- [TypeScript](https://www.typescriptlang.org/) >= 4.1.3



## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Routes

Users:

/api/login

- POST: Permet de login l'utilisateur (libre à vous de choisir la méthode de login)



/api/users

- GET: Renvoie la liste des utilisateurs
- POST: Crée un utilisateur



/api/users/:id

- GET: Renvoie les informations d'un utilisateur (nom, prenom, email, groupes)
- PUT: Modifie un utilisateur
- DELETE: Supprime un utilisateur

Groups:

/api/groups

- GET: Renvoie la liste des groupes
- POST: Crée un groupe



/api/groups/:id

- GET: Renvoie les informations d'un groupe (noms du groupe, utilisateurs, roles)
- PUT: Modifie un groupe
- DELETE: Supprime un groupe



/api/groups/:id/users

- POST: Ajoute un utilisateur à un groupe
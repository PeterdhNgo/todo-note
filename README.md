# todo-note

A full-stack notes application supporting plain text notes and checklists, with user accounts and per-user data isolation.
 
Built as part of an internship project at IDC MetaServ.

## Stack
 
| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Backend | NestJS 11, TypeScript |
| Database | PostgreSQL 16 |
| ORM | TypeORM |
| Auth | JWT (Passport), bcrypt password hashing |
 
## Features
 
- Register and log in with email and password
- Create, view, edit, and delete notes
- Two note types: free text, or a checklist with tickable items
- Six note colours
- Notes are strictly scoped to their owner — no user can read or modify another user's notes
- Cards truncate long content, with a full-size modal view

## Prerequisites
 
- **Node.js 20 or later** (`node --version`)
- **Docker and Docker Compose** — used to run PostgreSQL locally
> **No Docker?** Any PostgreSQL 16 instance will work. Create a database and user, then point `DB_HOST` and `DB_PORT` in `api/.env` at it. Nothing in the application depends on Docker.

## Setup
 
**1. Clone and install dependencies**
 
```bash
git clone <repository-url>
cd todo-note
npm run install:all
```
 
**2. Create the environment file**
 
```bash
cp api/.env.example api/.env
```
 
The defaults match the Docker Compose configuration, so no edits are needed for local development. Replace `JWT_SECRET` with a random value:
 
```bash
openssl rand -hex 32
```
 
**3. Start PostgreSQL**
 
```bash
docker compose up -d
```
 
Verify it is running:
 
```bash
docker compose ps
```
 
**4. Start the application**
 
```bash
npm run dev
```
 
This starts the NestJS API on port 3000 and the Vite dev server on port 5173.

**5. Open the app**
 
Visit <http://localhost:5173>. Register any email address with a password of at least 10 characters — there is no seeded account.

# Sistering

A volunteer management web application built for [Sistering](https://sistering.org/).

Made with [starter-code-v2](https://github.com/uwblueprint/starter-code-v2), brought to you by the UW Blueprint Internal Tools team!


## Table of Contents
* 👷 [Getting Started](#getting-started)
  * ✔️ [Prerequisites](#prerequisites)
  * ⚙️ [Set up](#set-up)
* 🧰 [Useful Commands](#useful-commands)
  * ℹ️ [Get Names and Statuses of Running Containers](#get-names-and-statuses-of-running-containers)
  * 💽 [Accessing PostgreSQL Database](#accessing-postgresql-database)
  * ✨ [Linting and Formatting](#linting-and-formatting)
  * 🧪 [Running Tests](#running-tests)
* 🌳 [Version Control Guide](#version-control-guide)
  * 🌿 [Branching](#branching)
  * 🔒 [Commits](#commits)


## Getting Started

### Prerequisites

* Install Docker Desktop ([MacOS](https://docs.docker.com/docker-for-mac/install/) | [Windows (Home)](https://docs.docker.com/docker-for-windows/install-windows-home/) | [Windows (Pro, Enterprise, Education)](https://docs.docker.com/docker-for-windows/install/) | [Linux](https://docs.docker.com/engine/install/#server)) and ensure that it is running
```bash
# these commands should give error-free output
docker info
docker-compose --version
```
* Ask a member of the Sistering dev team to be added to our Firebase project
* Set up Vault client for secret management, see instructions [here](https://www.notion.so/uwblueprintexecs/Secret-Management-2d5b59ef0987415e93ec951ce05bf03e)


### Set up

1. Clone this repository and `cd` into the project folder
```bash
git clone https://github.com/uwblueprint/sistering.git
cd sistering
```
2. Pull secrets from Vault
```
vault kv get -format=json kv/sistering | python update_secret_files.py
```
3. Set a post-merge Git hook to automatically pull from Vault after every pull on origin's `main` branch
```bash
./setup.sh "kv/sistering" "main"
```
4. Run the application
```bash
docker-compose up --build
```


## Useful Commands

### Get Names and Statuses of Running Containers
```bash
docker ps
```

### Accessing PostgreSQL Database

```bash
# run a psql shell in the DB container (postgres is the default user)
docker exec -it <container-name> /bin/bash -c "psql -U postgres -d sistering"

# in postgres shell, some common commands:
# display all table names
\dt
# display user-defined types, including enums
\dT+
# quit
\q
# you can run any SQL query, don't forget the semicolon!
SELECT * FROM <table-name>;
```

### Linting and Formatting
```bash
# linting & formatting warnings only
docker exec -it <container-name> /bin/bash -c "yarn lint"

# linting with fix & formatting
docker exec -it <container-name> /bin/bash -c "yarn fix"
```

### Running Tests
```bash
docker exec -it <container-name> /bin/bash -c "yarn test"
```

## Migration

To create a new migration, change the schema.prisma file as required
and run `npx prisma migrate dev --name <DESCRIPTIVE_NAME> --create-only`

NOTE: You should be running this in the backend docker container cli, not locally. This is because the DB secrets will only be injected in that container

## Version Control Guide

### Branching
* Branch off of `main` for all feature work and bug fixes, creating a "feature branch". Prefix the feature branch name with your name. The branch name should be in kebab case and it should be short and descriptive. E.g. `sherry/readme-update`
* To integrate changes on `main` into your feature branch, **use rebase instead of merge**

```bash
# currently working on feature branch, there are new commits on main
git pull origin main --rebase

# if there are conflicts, resolve them and then:
git add .
git rebase --continue

# force push to remote feature branch
git push -f
```

### Commits
* Commits should be atomic (guideline: the commit is self-contained; a reviewer could make sense of it even if they viewed the commit diff in isolation)
* Trivial commits (e.g. fixing a typo in the previous commit, formatting changes) should be squashed or fixup'd into the last non-trivial commit

```bash
# last commit contained a typo, fixed now
git add .
git commit -m "Fix typo"

# fixup into previous commit through interactive rebase
# x in HEAD~x refers to the last x commits you want to view
git rebase -i HEAD~2
# text editor opens, follow instructions in there to fixup

# force push to remote feature branch
git push -f
```

* Commit messages and PR names are descriptive and written in **imperative tense**<sup>1</sup>. The first word should be capitalized. E.g. "Create user REST endpoints", not "Created user REST endpoints"
* PRs can contain multiple commits, they do not need to be squashed together before merging as long as each commit is atomic. Our repo is configured to only allow squash commits to `main` so the entire PR will appear as 1 commit on `main`, but the individual commits are preserved when viewing the PR.

---

1: From Git's own [guidelines](https://github.com/git/git/blob/311531c9de557d25ac087c1637818bd2aad6eb3a/Documentation/SubmittingPatches#L139-L145)

# BuilderBot

## Setup

> **NOTE:** This project is currently only supported on Linux or macOS. If you are on Windows you can use the [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install) to run this project.
>
> There is a great video for setting up and using WSL [here](https://www.youtube.com/watch?v=oF6gLyhQDdw).

### Creating a Discord bot

- https://discord.dev
- Enable all privileged intents
- Copy the bot token to an environment variable called `BUILDER_BOT_TOKEN`

### Database setup

- Install [PostgreSQL](https://www.postgresql.org/download/)
- Create a user called `builderbot` with the password `builderbot`, make it superuser
- Create a database called `builderbot` owned by the user `builderbot`
- Copy the file `/packages/bot-prisma/.env.example` to `/packages/bot-prisma/.env`

### Installing NVM

- https://github.com/nvm-sh/nvm#installing-and-updating

### Installing Node.js

```bash
nvm install 18
nvm use 18
```

### Installing pnpm

```bash
npm install -g pnpm
```

### Installing dependencies

```bash
pnpm i
```

### Running the project

```bash
pnpm dev
```

## Development

The bot looks for a couple things to run:
- an `AssociatesConfiguration` entry, this just defines the category for the bot to watch and create start messages in, as well as the delay for retakes and the role id to give
- an `AssociatesQuiz` entry, which is just what ties all the questions together
  - any number of `AssociatesQuestions` entries, which are just the questions with the question text
    - any number of `AssociatesQuestionChoices` entries, which are the choices for the question, they can me marked as correct or not

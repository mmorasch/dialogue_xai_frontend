# dialogue_xai_frontend - intro für dimi

## Installation

### Requirements

- node version 18.14.1

### How to run

1. npm install
2. start the backend (python server)
3. npm run dev

## Paths

- `/` currently the intro
- `/experiment` the chatbot experiment
- `/exit` the exit questionnaire, sometimes not working

## Problems

### Endpoint is hardcoded

The endpoint is hardcoded in the file `/src/lib/settings.ts` -> BACKEND. `localhost` sometimes does not work, so I set it to my machines IP address. If you want to run it on your machine, you have to change it to your IP address. The python app prints the IP address when it starts.

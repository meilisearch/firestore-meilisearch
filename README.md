<h1 align="center">firestore-meilisearch ⚠ WIP ⚠️</h1>

<p align="center">
  <a href="https://app.bors.tech/repositories/35984"><img src="https://bors.tech/images/badge_small.svg" alt="Bors enabled"></a>
</p>

## Fulltext Search on Firebase with Meilisearch

### To run this project in local

`npm install -g firebase-tools`

`firebase login`

`firebase --open-sesame extdev`

You maybe need to install typescript in global to run this project<br>
`npm install typescript -g`

`npm run install`

`npm run build`

`firebase emulators:start`

Launch emulator with dataset and param<br>
You should create test-params.env file<br>
`firebase ext:dev:emulators:start --test-params=test-params.env --import=dataset --project=name-of-the-project`

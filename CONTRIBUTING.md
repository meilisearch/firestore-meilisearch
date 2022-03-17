# Contributing

First of all, thank you for contributing to Meilisearch! The goal of this document is to provide everything you need to know in order to contribute to Meilisearch and its different integrations.

<!-- MarkdownTOC autolink="true" style="ordered" indent="   " -->

- [Assumptions](#assumptions)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Git Guidelines](#git-guidelines)
- [Release Process (for internal team only)](#release-process-for-internal-team-only)

<!-- /MarkdownTOC -->

## Assumptions

1. **You're familiar with [GitHub](https://github.com) and the [Pull Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) (PR) workflow.**
2. **You've read the Meilisearch [documentation](https://docs.meilisearch.com) and the [README](/README.md).**
3. **You know about the [Meilisearch community](https://docs.meilisearch.com/learn/what_is_meilisearch/contact.html). Please use this for help.**

## How to Contribute

1. Make sure that the contribution you want to make is explained or detailed in a GitHub issue! Find an [existing issue](https://github.com/meilisearch/meilisearch-js/issues/) or [open a new one](https://github.com/meilisearch/meilisearch-js/issues/new).
2. Once done, [fork the firestore-meilisearch repository](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) in your own GitHub account. Ask a maintainer if you want your issue to be checked before making a PR.
3. [Create a new Git branch](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-and-deleting-branches-within-your-repository).
4. Review the [Development Workflow](#development-workflow) section that describes the steps to maintain the repository.
5. Make the changes on your branch.
6. [Submit the branch as a PR](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork) pointing to the `main` branch of the main meilisearch-js repository. A maintainer should comment and/or review your Pull Request within a few days. Although depending on the circumstances, it may take longer.<br>
 We do not enforce a naming convention for the PRs, but **please use something descriptive of your changes**, having in mind that the title of your PR will be automatically added to the next [release changelog](https://github.com/meilisearch/meilisearch-js/releases/).

## Development Workflow

### Requirements <!-- omit in toc -->

To run this project, you will need:

- Node >= 14 && node <= 17
- Npm >= v7
- A google account
- Latest version of `firebase-tools` the Firebase CLI:
  ``` bash
  yarn global add firebase-tools
  ```
  Add the directory for the commands of the packages installed globally in yarn, to access of firebase binary:
  ``` bash
  export PATH="$(yarn global bin):$PATH"
  ```

### Setup <!-- omit in toc -->

Sign in with your Google Account:
``` bash
firebase login
```
Enable the extension developer commands:
``` bash
firebase --open-sesame extdev
```
Install dependencies:
``` bash
yarn install:functions
```
Build the project:
``` bash
yarn build
```
Launch Meilisearch instance:
``` bash
curl -L https://install.meilisearch.com | sh # download Meilisearch
./meilisearch --master-key=masterKey --no-analytics # run Meilisearch
```
Launch emulator:
``` bash
firebase ext:dev:emulators:start --test-params=test-params-example.env --import=dataset --project=name-of-the-project
```
or just
``` bash
yarn emulator
```
The emulator runs with environment parameters found in `test-params-example.env` and with a provided dataset found in `/dataset`.

Once it is running, open the emulator in a browser at the following address: http://localhost:4000

NB: If you want to change your Meilisearch credentials or the plugins options you need to edit the `test-params-example.env` file.

### Tests and Linter <!-- omit in toc -->

Each PR should pass the tests and the linter to be accepted.

```bash
curl -L https://install.meilisearch.com | sh # download Meilisearch
./meilisearch --master-key=masterKey --no-analytics # run Meilisearch

# Tests
yarn test

# Tests in watch mode
yarn test:watch

# Linter
yarn lint

# Linter with fixing
yarn lint:fix

# Build the project
yarn build
```

### Run the backfilled-data script

Run the import script using [`npx` (the Node Package Runner)](https://www.npmjs.com/package/npx).
- Set up credentials. The import script uses the application's default credentials to communicate with Firebase. Please follow the instructions [generate a private key file for your service account](https://firebase.google.com/docs/admin/setup#initialize-sdk).

- Run the import script interactively using `npx` and run ONE of the following commands:
  - Run interactively:
    ```bash
    npx firestore-meilisearch
    ```

  - Or run non-interactively with paramaters:
    ```bash
    npx firestore-meilisearch \
      --project <project_id> \
      --source-collection-path <collection_name> \
      --index <index_uid> \
      --batch-size <100/default=300> \
      --host <host_address> \
      --api-key <api_key> \
      --non-interactive
    ```
    **Note**: The `--batch-size` and `--query-collection-group` arguments are optional. To see its usage, run the above command with `--help`.

- Run the project for development:
Launch Meilisearch instance:
``` bash
curl -L https://install.meilisearch.com | sh # download Meilisearch
./meilisearch --master-key=masterKey --no-analytics # run Meilisearch
```
Launch the watcher on the project:
``` bash
yarn watch
```
Launch the watcher on the script. You have to modify the informations of the playground script by your own parameters inside the `package.json` file:
``` bash
yarn playground
```

## Git Guidelines

### Git Branches <!-- omit in toc -->

All changes must be made in a branch and submitted as PR.
We do not enforce any branch naming style, but please use something descriptive of your changes.

### Git Commits <!-- omit in toc -->

As minimal requirements, your commit message should:
- be capitalized
- not finish by a dot or any other punctuation character (!,?)
- start with a verb so that we can read your commit message this way: "This commit will ...", where "..." is the commit message.
  e.g.: "Fix the home page button" or "Add more tests for create_index method"

We don't follow any other convention, but if you want to use one, we recommend [this one](https://chris.beams.io/posts/git-commit/).

### GitHub Pull Requests <!-- omit in toc -->

Some notes on GitHub PRs:

- [Convert your PR as a draft](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/changing-the-stage-of-a-pull-request) if your changes are a work in progress: no one will review it until you pass your PR as ready for review.<br>
  The draft PR can be very useful if you want to show that you are working on something and make your work visible.
- The branch related to the PR must be **up-to-date with `main`** before merging. Fortunately, this project [integrates a bot](https://github.com/meilisearch/integration-guides/blob/main/resources/bors.md) to automatically enforce this requirement without the PR author having to do it manually.
- All PRs must be reviewed and approved by at least one maintainer.
- The PR title should be accurate and descriptive of the changes. The title of the PR will be indeed automatically added to the next [release changelogs](https://github.com/meilisearch/meilisearch-js/releases/).

## Release Process (for internal team only)

Meilisearch tools follow the [Semantic Versioning Convention](https://semver.org/).

### Automation to Rebase and Merge the PRs <!-- omit in toc -->

This project integrates a bot that helps us manage pull requests merging.<br>
_[Read more about this](https://github.com/meilisearch/integration-guides/blob/main/resources/bors.md)._

### Automated Changelogs <!-- omit in toc -->

This project integrates a tool to create automated changelogs.<br>
_[Read more about this](https://github.com/meilisearch/integration-guides/blob/main/resources/release-drafter.md)._

### How to Publish the Release <!-- omit in toc -->

⚠️ Before doing anything, make sure you got through the guide about [Releasing an Integration](https://github.com/meilisearch/integration-guides/blob/main/resources/integration-release.md).

1. Make a PR modifying the files [`package.json`](/package.json), [`package.json` in functions directory](/functions/package.json) and the [`extension.yaml`](/extension.yaml) with the right version.

```yaml
"version": "X.X.X",
```

2. Test the extension  by installing it on Firestore database:
```bash
firebase ext:install . --project=meilisearch-e2fe1
```

3. Publish the extension by run the following command in the root of the extension directory:
```bash
firebase ext:dev:publish meilisearch/firestore-meilisearch --project=meilisearch-e2fe1
```
**Note**: `meilisearch` is the publisher id and `meilisearch-e2fe1` is the publish project id for this extension.

Once the changes are merged on `main`, you can publish the current draft release via the [GitHub interface](https://github.com/meilisearch/meilisearch-go/releases): on this page, click on `Edit` (related to the draft release) > update the description (be sure you apply [these recommandations](https://github.com/meilisearch/integration-guides/blob/main/resources/integration-release.md#writting-the-release-description)) > when you are ready, click on `Publish release`.

<hr>

Thank you again for reading this through, we can not wait to begin to work with you if you made your way through this contributing guide ❤️

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
7. You will need to build the project with `yarn build` before pushing files.
8. Don't forget to add `js` files from the `./lib/` directory to your PR.

## Development Workflow

### Requirements <!-- omit in toc -->

To run this project, you will need:

- Node >= 14 && node <= 18
- Npm >= v7
- A google account
- Version `v10.9.2` of `firebase-tools` the Firebase CLI (latest does not provide the emulator):
  ``` bash
  yarn global add firebase-tools@10.9.2
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
You may need to [install Java](https://www.java.com/en/download/help/download_options.html) to run the emulator.</br>
Set emulator:
```bash
firebase init emulators
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

- Set up credentials. The import script uses the application's default credentials to communicate with Firebase. Please follow the instructions [generate a private key file for your service account](https://firebase.google.com/docs/admin/setup#initialize-sdk).

- Run the import script interactively and run ONE of the following commands:
  - Run interactively:
    ```bash
    yarn run-cli
    ```

  - Or run non-interactively with paramaters:
    ```bash
    yarn run-cli \
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

### Generate the README

The Firebase CLI offers the possibility of automatically generating the `README.md` file with the following command:
```bash
firebase ext:info ./path/to/extension --markdown > README.md
```
**Note:** Be careful this will only regenerate the text of the central part of the `README.md` from the Title: `Search in your Firestore content with Meilisearch` to the `**Cloud Functions:**` section.

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

Make a PR modifying the files with the right version.

Either by running `version.sh` with the new version. Example: `sh script/version.sh 0.3.1` or by updating manually the following files:

- [`package.json`](/package.json).
- [`package.json`](/functions/package.json) in the functions directory.
- [`extension.yaml`](/extension.yaml).
- [`version.ts`](/functions/src/version.ts).

Update the `CHANGELOG.md` file by creating a new section at the bottom `## Version X.X.X`. You can take inspiration from the [release draft](https://github.com/meilisearch/firestore-meilisearch/releases).

5. Once the changes are merged on `main`, you can publish the current draft release via the [GitHub interface](https://github.com/meilisearch/firestore-meilisearch/releases): on this page, click on `Edit` (related to the draft release) > update the description (be sure you apply [this recommandation](https://github.com/meilisearch/integration-guides/blob/main/resources/integration-release.md#writting-the-release-description)) > when you are ready, click on `Publish release`.

GitHub Actions will be triggered and push the package to [npm](https://www.npmjs.com/package/firestore-meilisearch) and to [firebase](https://firebase.google.com/products/extensions).

6. Test the newly released package on npm by launching it with `npx`:
```
npx firestore-meilisearch
```

7. Publish the extension by running the following command in the root of the extension directory:
```bash
firebase ext:dev:publish meilisearch/firestore-meilisearch
```
**Note**: `meilisearch` is the `publisher id` for this extension.

#### Release a `beta` Version

Here are the steps to release a beta version of this package:

- Create a new branch containing the "beta" changes with the following format `xxx-beta` where `xxx` explains the context.

  For example:
    - When implementing a beta feature, create a branch `my-feature-beta` where you implement the feature.
      ```bash
        git checkout -b my-feature-beta
      ```
    - During the Meilisearch pre-release, create a branch originating from `bump-meilisearch-v*.*.*` named `bump-meilisearch-v*.*.*-beta`. <br>
    `v*.*.*` is the next version of the package, NOT the version of Meilisearch!

      ```bash
      git checkout bump-meilisearch-v*.*.*
      git pull origin bump-meilisearch-v*.*.*
      git checkout -b bump-meilisearch-v*.*.*-beta
      ```

- Change the version in the relevant files (see how to publish the release section above) and commit it to the `v*.*.*-beta` branch. None or multiple `-xxx`are valid. Examples:
  - `v*.*.*-my-feature-beta.0`
  - `v*.*.*-beta.0`

- Go to the [GitHub interface for releasing](https://github.com/meilisearch/firestore-meilisearch/releases): on this page, click on `Draft a new release`.

- Create a GitHub pre-release:
  - Fill the description with the detailed changelogs
  - Fill the title with `vX.X.X-beta.0`
  - Fill the tag with `vX.X.X-beta.0`
  - ⚠️ Select the `vX.X.X-beta.0` branch and NOT `main`
  - ⚠️ Click on the "This is a pre-release" checkbox
  - Click on "Publish release"

GitHub Actions will be triggered and push the beta version to [npm](https://www.npmjs.com/package/firestore-meilisearch).

💡 If you need to release a new beta for the same version (i.e. `vX.X.X-beta.1`):
- merge the change into `bump-meilisearch-v*.*.*`
- rebase the `vX.X.X-beta.0` branch
- change the version name in `package.json`
- creata a pre-release via the GitHub interface


<hr>

Thank you again for reading this through, we can not wait to begin to work with you if you made your way through this contributing guide ❤️

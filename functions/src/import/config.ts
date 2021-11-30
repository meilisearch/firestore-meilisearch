import { Command } from 'commander'
import * as inquirer from 'inquirer'
import { MeiliSearchConfig } from '../types'

const FIRESTORE_VALID_CHARACTERS = /^[^/]+$/
const FIRESTORE_COLLECTION_NAME_MAX_CHARS = 6144
const PROJECT_ID_MAX_CHARS = 6144
const MEILISEARCH_VALID_CHARACTERS = /^[a-zA-Z-_0-9,]*$/
const MEILISEARCH_UID_MAX_CHARS = 6144

const program = new Command()

program
  .name('firestore-meilisearch')
  .option(
    '--non-interactive',
    'Parse all input from command line flags instead of prompting the caller.',
    false
  )
  .option(
    '-P, --project <project>',
    'Firebase Project ID for project containing the Cloud Firestore database.'
  )
  .option(
    '-s, --source-collection-path <source-collection-path>',
    'The path of the the Cloud Firestore Collection to import from. (This may, or may not, be the same Collection for which you plan to mirror changes.)'
  )
  .option(
    '-q, --query-collection-group [true|false]',
    "Use 'true' for a collection group query, otherwise a collection query is performed."
  )
  .option(
    '-i, --index <index>',
    "The Uid of the index in MeiliSearch to import to. (A index will be created if it doesn't already exist.)"
  )
  .option(
    '-b, --batch-size [batch-size]',
    'Number of documents to stream into MeiliSearch at once.',
    value => parseInt(value, 10),
    300
  )
  .option(
    '-H, --host <host>',
    "The Host of your meilisearch database. Example: 'http://localhost:7700'."
  )
  .option(
    '-a, --api-key <api-key>',
    'The MeiliSearch API key with permission to perform actions on indexes. Both the private key and the master key are valid choices but we strongly recommend using the private key for security purposes.'
  )

const validateInput = (
  value: string,
  name: string,
  regex: RegExp,
  sizeLimit: number
) => {
  if (!value || value === '' || value.trim() === '') {
    return `Please supply a ${name}`
  }
  if (value.length >= sizeLimit) {
    return `${name} must be at most ${sizeLimit} characters long`
  }
  if (!value.match(regex)) {
    return `The ${name} does not match the regular expression provided`
  }
  return true
}

const validateBatchSize = (value: string) => {
  return parseInt(value, 10) > 0
}

const questions = [
  {
    message: 'What is your Firebase project ID?',
    name: 'project',
    type: 'input',
    validate: value =>
      validateInput(
        value,
        'project ID',
        FIRESTORE_VALID_CHARACTERS,
        PROJECT_ID_MAX_CHARS
      ),
  },
  {
    message:
      'What is the path of the the Cloud Firestore Collection you would like to import from? ' +
      '(This may, or may not, be the same Collection for which you plan to mirror changes.)',
    name: 'sourceCollectionPath',
    type: 'input',
    validate: value =>
      validateInput(
        value,
        'collection path',
        FIRESTORE_VALID_CHARACTERS,
        FIRESTORE_COLLECTION_NAME_MAX_CHARS
      ),
  },
  {
    message: 'Would you like to import documents via a Collection Group query?',
    name: 'queryCollectionGroup',
    type: 'confirm',
    default: false,
  },
  {
    message:
      "What is the Uid of the MeiliSearch index that you would like to use? (A index will be created if it doesn't already exist)",
    name: 'index',
    type: 'input',
    validate: value =>
      validateInput(
        value,
        'index',
        MEILISEARCH_VALID_CHARACTERS,
        MEILISEARCH_UID_MAX_CHARS
      ),
  },
  {
    message:
      'How many documents should the import stream into MeiliSearch at once?',
    name: 'batchSize',
    type: 'input',
    default: 300,
    validate: validateBatchSize,
  },
  {
    message:
      "What is the host of the MeiliSearch database that you would like to use? Example: 'http://localhost:7700'.",
    name: 'host',
    type: 'input',
  },
  {
    message:
      'What The MeiliSearch API key with permission to perform actions on indexes. Both the private key and the master key are valid choices but we strongly recommend using the private key for security purposes.',
    name: 'apiKey',
    type: 'input',
  },
]

export interface CliConfig {
  projectId: string
  sourceCollectionPath: string
  queryCollectionGroup: boolean
  batchSize: string
  meilisearch: MeiliSearchConfig
}

/**
 * Parse the argument from the command line.
 */
export async function parseConfig(): Promise<CliConfig> {
  program.parse(process.argv)

  const options = program.opts()
  if (options.nonInteractive) {
    if (
      options.project === undefined ||
      options.sourceCollectionPath === undefined ||
      options.index === undefined ||
      options.host === undefined ||
      options.apiKey === undefined ||
      !validateBatchSize(options.batchSize)
    ) {
      program.outputHelp()
      process.exit(1)
    }

    return {
      projectId: options.project,
      sourceCollectionPath: options.sourceCollectionPath,
      queryCollectionGroup: options.queryCollectionGroup === 'true',
      batchSize: options.batchSize,
      meilisearch: {
        indexUid: options.index,
        host: options.host,
        apiKey: options.apiKey,
      },
    }
  }
  const {
    project,
    sourceCollectionPath,
    queryCollectionGroup,
    index,
    batchSize,
    host,
    apiKey,
  } = await inquirer.prompt(questions)

  return {
    projectId: project,
    sourceCollectionPath: sourceCollectionPath,
    queryCollectionGroup: queryCollectionGroup,
    batchSize: batchSize,
    meilisearch: {
      indexUid: options.index,
      host: options.host,
      apiKey: options.apiKey,
    },
  }
}

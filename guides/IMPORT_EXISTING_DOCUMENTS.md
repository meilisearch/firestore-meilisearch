The `firestore-meilisearch` script is for use with the official Firebase Extension [**Meilisearch**](https://github.com/firebase/extensions/tree/main/firestore-meilisearch).

### Overview

The import script reads all existing documents in a Cloud Firestore collection or in sub-collections and index them into an index in Meilisearch.

#### Important notes

- You must run the import script over the entire collection **_after_** installing the Meilisearch extension in Firebase; otherwise all the data written in the meantime or during the import in your database might not be exported to your `${param:MEILISEARCH_INDEX_NAME}` index.

- The import script may take a while to complete if your collection is large. In which case we suggest setting a larger batch size in the configuration.

- You cannot use wildcard notation in the collection path (i.e. `/collection/{document}/sub_collection}`). Instead, you can use a collectionGroup query. To use a collectionGroup query, provide the collection name value as `${COLLECTION_PATH}`, and set `${COLLECTION_GROUP_QUERY}` to true.

Warning: A collectionGroup query will target every collection in your Firestore project with the provided `${COLLECTION_PATH}`. For example, if you have 10,000 documents with a sub-collection named: actors, the import script will query every document in 10,000 actors collections.

### Run the script

The import script uses several values from the configuration provided when you installed the extension:

- `${PROJECT_ID}`: the project ID for the Firebase project in which you installed the extension
- `${COLLECTION_PATH}`: the collection path that you specified during extension installation
- `${COLLECTION_GROUP_QUERY}`: uses a collectionGroup query if this value is "true". For any other value, a collection query is used.
- `${MEILISEARCH_INDEX_NAME}`: the UID of the Meilisearch index that you specified for your indexation during extension installation
- `${BATCHSIZE}`: the number of documents you want to import into Meilisearch at once
- `${MEILISEARCH_HOST}`: the url of the host of the Meilisearch database that you specified during extension installation
- `${MEILISEARCH_API_KEY}`: the Meilisearch API key with permission to perform actions on indexes you specified during extension installation

Run the import script using [`npx` (the Node Package Runner)](https://www.npmjs.com/package/npx).

1.  Make sure that you've installed the required tools to run the import script:

    - To access the `npm` command tools, you need to install [Node.js](https://www.nodejs.org/).
    - If you use `npm` v5.1 or earlier, you need to explicitly install `npx`. Run `npm install --global npx`.

2.  Set up credentials. The import script uses Application Default Credentials to communicate with Firebase. Please follow the instructions to [create and use a service account](https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually).

3.  Run the import script interactively via `npx` by running the following command:

  - Run interactively:
    ```bash
    npx firestore-meilisearch
    ```
    When prompted, enter the Cloud Firestore collection path that you specified during extension installation, `${COLLECTION_PATH}` along with any other arguments.

  - Run non-interactively with paramaters:
    ```bash
    npx firestore-meilisearch
      --project <project_id> \
      --source-collection-path <collection_name> \
      --index <index_uid> \
      --batch-size <100/default=300> \
      --host <host_address> \
      --api-key <api_key> \
      --non-interactive
    ```
    **Note**: The `--batch-size` and `--query-collection-group` arguments are optional. To see its usage, run the above command with `--help`.

4. Check if the index and Document are imported in Meilisearch:

  1. Check that the index has been created.:
    ```bash
    curl \
      -X GET 'http://${MEILISEARCH_HOST}/indexes/${MEILISEARCH_INDEX_NAME}'
    ```
    **Note**:  This example must be launched in your terminal but if you are already using the Meilisearch SDK you can use the command related to the [latter](https://docs.meilisearch.com/reference/api/indexes.html#get-one-index)

  2. Check that the documents has been added to your Meilisearch database:
    ```bash
    curl \
      -X GET 'http://${MEILISEARCH_HOST}/indexes/${MEILISEARCH_INDEX_NAME}/stats'
    ```
    The response will contain the number of documents in Meilisearch index.
    **Note**:  This example must be launched in your terminal but if you are already using the Meilisearch SDK you can use the command related to the [latter](https://docs.meilisearch.com/reference/api/stats.html#get-stat-of-an-index)

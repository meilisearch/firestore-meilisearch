### See it in action

You can test out this extension right away!

1.  Go to your [Cloud Firestore dashboard](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore/data) in the Firebase console

2.  If it doesn't already exist, create the collection you specified during installation: `${param:COLLECTION_PATH}`

3.  Create, update, or delete a document in the collection called `${param:COLLECTION_PATH}` that contains any fields with any values that you'd like.

4.  You can check the status of tasks in your Meilisearch instance using the following query:

    ```
    curl \
      -X GET '${param:MEILISEARCH_HOST}/tasks'
    ```
    You can read more on [tasks](https://docs.meilisearch.com/reference/api/tasks.html#tasks) in the documentation.

### Using the extension

Whenever a document is created, updated, or deleted in the specified collection `${param:COLLECTION_PATH}`, this extension sends that update to your Meilisearch instance.

This extension:
- Indexes a document in Meilisearch and sends all the fields or configured fields defined in the extension
- Updates a document in your Meilisearch index
- Deletes a document from your Meilisearch index

### _(Optional)_ Import existing documents

This extension does not export your existing document dataset in Meilisearch. It will only export the documents that have been modified or created after installation. To populate your Meilisearch database with all the documents in your Firestore collection, you need to run the import script provided by this extension.

The import script reads all existing documents in a Cloud Firestore collection or group collection and indexes them into Meilisearch.

**Important:** Run the import script over the entire collection _after_ installing this extension; otherwise, you may lose the current writes in your database during the import.

Learn more about using the import script to [backfill your existing collection](https://github.com/meilisearch/firestore-meilisearch/blob/main/guides/IMPORT_EXISTING_DOCUMENTS.md).

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.

Nonetheless, Most of Meilisearch tasks are [asynchronous](https://docs.meilisearch.com/learn/advanced/asynchronous_operations.html#which-operations-are-async), meaning for example that errors on documents addition/deletion/... are not logged in your extensions logs. To access these logs, use the [tasks API](https://docs.meilisearch.com/reference/api/tasks.html).

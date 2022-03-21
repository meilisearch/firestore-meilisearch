### See it in action

You can test out this extension right away!

1.  Go to your [Cloud Firestore dashboard](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore/data) in the Firebase console.

2.  If it doesn't already exist, create the collection you specified during installation: `${param:COLLECTION_PATH}`

3.  Create, update, or delete a document in the collection called `${param:COLLECTION_PATH}` that contains any fields with any values that you'd like.

4.  You can check the tasks of your Meilisearch instance with this query to see if the action has been well performed:

    ```
    curl \
      -X GET '`${param:MEILISEARCH_HOST}`/tasks'
    ```
    More on [tasks](https://docs.meilisearch.com/reference/api/tasks.html#tasks)

### Using the extension

Whenever a document is created, updated, or deleted in the specified collection `${param:COLLECTION_PATH}`, this extension sends that update to your Meilisearch instance.

This extension:
- Indexes a document in Meilisearch and send all the fields or configured fields defined in the extension.
- Update a document in your Meilisearch index.
- Delete a document from your Meilisearch index.

### _(Optional)_ Import existing documents

This extension will only export your documents if they have been modified or created after its installation -- it does not export your complete dataset of existing documents into Meilisearch. So, to backfill your Meilisearch dataset with all the documents present in your Firestore collection, you can run the import script provided by this extension.

The import script can read all existing documents in a Cloud Firestore collection or group collection and index them into a index in Meilisearch.

**Important:** Run the import script over the entire collection _after_ installing this extension, otherwise all writes to your database during the import might be lost.

Learn more about using the import script to [backfill your existing collection](https://github.com/meilisearch/firestore-meilisearch/blob/main/guides/IMPORT_EXISTING_DOCUMENTS.md).

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.

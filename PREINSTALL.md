Use this extension to synchronize documents from a Cloud Firestore collection to a Meilisearch index. This allows you to use a full text search in your Cloud Firestore documents.

This extension listens to each creation, update or deletion of your documents to keep them sync with your Meilisearch index, so the data in Meilisearch is a mirror of your content in Cloud Firestore. You can then run queries on this mirrored dataset.

Note that this extension only listens for changes to _documents_ in a specific collection, but not changes in any _subcollection_. However, you can install additional instances of this extension to listen to other collections in your Firestore database.

#### Additional setup

Before installing this extension, you'll need to:

- [Set up Cloud Firestore in your Firebase project.](https://firebase.google.com/docs/firestore/quickstart)
- Run Meilisearch instance. There are many easy ways [to download and run a Meilisearch instance.](https://docs.meilisearch.com/learn/getting_started/installation.html#download-and-launch)

#### Data import format

Documents indexed in Meilisearch need to have a [unique id](https://docs.meilisearch.com/learn/core_concepts/documents.html#primary-field), to do so this extension will use the default field provided for this purpose in Firestore: `Document ID` which will be renamed `_firestore_id` used as [document id](https://docs.meilisearch.com/learn/core_concepts/documents.html#document-id). If your documents have an `id` field it will be added to your documents without it being your primary key.

**Important:**  If your document have a field `_firestore_id` it will be ignored.

[GeoSearch](https://docs.meilisearch.com/reference/features/geosearch.html#geosearch) has a specific format in Meilisearch, if a `GeoPoint` from Firestore with the name `_geo` is found the field `latitude` is renamed to `lat` and the field `longitude` to `lng`.
If a `GeoPoint` is found without the name `_geo` it would added like an array.

#### Backfill your Meilisearch

This extension will only export your documents if they have been modified or created after its installation -- it does not export your complete dataset of existing documents into Meilisearch. So, to backfill your Meilisearch dataset with all the documents present in your Firestore collection, you can run the [import script](https://github.com/meilisearch/firestore-meilisearch/) provided by this extension.

#### Billing

To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

* You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
* This extension uses other Firebase or Google Cloud services which may have
  associated charges if you exceed the service’s free tier:
  *   Cloud Firestore
  *   Cloud Functions (Node.js 10+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))

When you use Firebase Extensions, you're only charged for the underlying
resources that you use. A paid-tier billing plan is only required if the
extension uses a service that requires a paid-tier plan, for example calling to
a Google Cloud API or making outbound network requests to non-Google services.
All Firebase services offer a free tier of usage.
[Learn more about Firebase billing.](https://firebase.google.com/pricing)

Use this extension to synchronize documents from a Cloud Firestore collection to a Meilisearch index. This allows you to use full-text search in your Cloud Firestore documents.

This extension listens to each creation, update, or deletion of your documents to keep them in sync with your Meilisearch index. This ensures that the data in Meilisearch mirrors your content in Cloud Firestore. You can then run queries on this mirrored dataset.

Note that this extension only listens for changes to _documents_ in a specific collection, but not changes in any _subcollection_. However, you can install additional instances of this extension to listen to other collections in your Firestore database.

#### Additional setup

Before installing this extension, you'll need to:

- [Set up Cloud Firestore in your Firebase project](https://firebase.google.com/docs/firestore/quickstart)
- Run a Meilisearch instance. [Learn more about Meilisearch cloud](https://www.meilisearch.com/pricing). Alternatively there are many other easy ways [to download and run a Meilisearch instance](https://docs.meilisearch.com/learn/getting_started/installation.html#download-and-launch)

#### Data import format

Documents indexed in Meilisearch must have a [unique id](https://docs.meilisearch.com/learn/core_concepts/documents.html#primary-field). The extension will use Firestore's default field: `Document ID` for this purpose. `Document ID` will be renamed  to`_firestore_id` to be used as the [document id](https://docs.meilisearch.com/learn/core_concepts/documents.html#document-id). If your documents have another field containing the string `id`, it will not be set as the primary key.

**Important:**  If your documents contain a field called `_firestore_id`, it will be ignored.

If you are using `GeoPoint`, the field should be named `_geo` to be recognized by Meilisearch for [geosearch]((https://docs.meilisearch.com/reference/features/geosearch.html#geosearch)).

#### Backfill your Meilisearch data

This extension does not export all existing documents into Meilisearch unless they have been modified or created after its installation. You can run the [import script](https://github.com/meilisearch/firestore-meilisearch/) provided by this extension to retrieve your Meilisearch dataset with all the documents present in your Firestore collection

#### Billing

To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

* You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension, even if it is not used.
* This extension uses other Firebase or Google Cloud services which may have
  associated charges if you exceed the service’s free tier:
  *   Cloud Firestore
  *   Cloud Functions (Node.js 10+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))

When you use Firebase extensions, you're only charged for the underlying
resources that you use. A paid-tier billing plan is only required if the
extension uses a service that requires a paid-tier plan, for example calling
a Google Cloud API or making outbound network requests to non-Google services.
All Firebase services offer a free tier of usage.
[Learn more about Firebase billing.](https://firebase.google.com/pricing)

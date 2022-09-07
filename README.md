<h1 align="center">firestore-meilisearch</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/meilisearch/integration-guides/main/assets/logos/meilisearch_firebase.svg" alt="Meilisearch-Firestore" width="200" height="200" />
</p>

<h1 align="center">Meilisearch Firestore</h1>

<h4 align="center">
  <a href="https://github.com/meilisearch/meilisearch">Meilisearch</a> |
  <a href="https://docs.meilisearch.com">Documentation</a> |
  <a href="https://slack.meilisearch.com">Slack</a> |
  <a href="https://roadmap.meilisearch.com/tabs/1-under-consideration">Roadmap</a> |
  <a href="https://www.meilisearch.com">Website</a> |
  <a href="https://docs.meilisearch.com/faq">FAQ</a>
</h4>

<p align="center">
  <a href="https://github.com/meilisearch/firestore-meilisearch/actions"><img src="https://github.com/meilisearch/firestore-meilisearch/workflows/Tests/badge.svg" alt="Test"></a>
  <a href="https://github.com/meilisearch/firestore-meilisearch/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-informational" alt="License"></a>
  <a href="https://ms-bors.herokuapp.com/repositories/8"><img src="https://bors.tech/images/badge_small.svg" alt="Bors enabled"></a>
</p>

<p align="center">⚡ The Meilisearch API extension written for Firebase</p>

# Search in your Firestore content with Meilisearch

**Author**: Meilisearch (**[https://meilisearch.com](https://meilisearch.com)**)

**Description**: Full-text Search on Firebase with Meilisearch

**Details**: Use this extension to synchronize documents from a Cloud Firestore collection to a Meilisearch index. This allows you to use full-text search in your Cloud Firestore documents.

This extension listens to each creation, update, or deletion of your documents to keep them in sync with your Meilisearch index. This ensures that the data in Meilisearch mirrors your content in Cloud Firestore. You can then run queries on this mirrored dataset.

Note that this extension only listens for changes to _documents_ in a specific collection, but not changes in any _subcollection_. However, you can install additional instances of this extension to listen to other collections in your Firestore database.

#### Additional setup

Before installing this extension, you'll need to:

- [Set up Cloud Firestore in your Firebase project](https://firebase.google.com/docs/firestore/quickstart)
- Run a Meilisearch instance. [Learn more about Meilisearch cloud](https://www.meilisearch.com/pricing). Alternatively there are many other easy ways [to download and run a Meilisearch instance](https://docs.meilisearch.com/learn/getting_started/installation.html#download-and-launch)

#### Data import format

Documents indexed in Meilisearch must have a [unique id](https://docs.meilisearch.com/learn/core_concepts/documents.html#primary-field). The extension will use Firestore's default field: `Document ID` for this purpose. `Document ID` will be renamed  to`_firestore_id` to be used as the [document id](https://docs.meilisearch.com/learn/core_concepts/documents.html#document-id). If your documents  have another field containing the string `id`, it will not be set as the primary key.

**Important:**  If your documents contain a field called `_firestore_id`, it will be ignored.

[Geosearch](https://docs.meilisearch.com/reference/features/geosearch.html#geosearch) has a specific format in Meilisearch, your documents must have a valid `_geo` field with an object composed of `lat` and `lng`. If a `GeoPoint` from Firestore with the name `_geo` is found, the field `latitude` is renamed to `lat` and `longitude` to `lng`.
If a `GeoPoint` is found without the name `_geo`, it is added as an array.

#### Backfill your Meilisearch data

This extension does not export all existing documents into Meilisearch unless they have been modified or created after its installation. You can run the [import script](./guides/IMPORT_EXISTING_DOCUMENTS.md) provided by this extension to retrieve your Meilisearch dataset with all the documents present in your Firestore collection

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




**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? If you need help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Collection path: What is the path of the collection you would like to export into Meilisearch?

* Fields to index in Meilisearch: What fields do you want to index in Meilisearch? Create a comma-separated list of the field names, or leave it blank to include all fields. The id field is always indexed even when omitted from the list.

* Meilisearch Index Name: What Meilisearch index do you want to index your data in?

* Meilisearch host: What is the URL of the host of your Meilisearch database? Make sure your URL starts with `http://` or `https://`

* Meilisearch API key: What is your Meilisearch API key with permission to perform actions on indexes? Both the API keys and the master key are valid choices but we strongly recommend using an API key for security purposes. Check out our guide on [security](https://docs.meilisearch.com/learn/security/master_api_keys.html).



**Cloud Functions:**

* **indexingWorker:** Cloud function triggered by document modification in Firestore to import changes into Meilisearch.

---

## 🧩 Install this extension

### Console

[![Install this extension in your Firebase project](https://www.gstatic.com/mobilesdk/210513_mobilesdk/install-extension.png "Install this extension in your Firebase project")][install-link]

[install-link]: https://console.firebase.google.com/project/_/extensions/install?ref=meilisearch/firestore-meilisearch

### Firebase CLI

```bash
firebase ext:install meilisearch/firestore-meilisearch --project=[your-project-id]
```

> Learn more about installing extensions in the Firebase Extensions documentation:
> [console](https://firebase.google.com/docs/extensions/install-extensions?platform=console),
> [CLI](https://firebase.google.com/docs/extensions/install-extensions?platform=cli)

---

## 🤖 Compatibility with Meilisearch

This package only guarantees the compatibility with the [version v0.28.0 of Meilisearch](https://github.com/meilisearch/meilisearch/releases/tag/v0.28.0).

## ⚙️ Development Workflow and Contributing

Any new contribution is more than welcome in this project!

If you want to know more about the development workflow or wish to contribute, please see our [contributing guidelines](/CONTRIBUTING.md) for detailed instructions!

<hr>

**Meilisearch** provides and maintains many **SDKs and Integration tools** like this one. We want to provide everyone with an **amazing search experience for any kind of project**. If you wish to contribute, make suggestions, or want to know what's going on right now, visit the [integration-guides](https://github.com/meilisearch/integration-guides) repository.

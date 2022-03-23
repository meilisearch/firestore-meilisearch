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

This extension listens to each creation, update or deletion of your documents to keep them sync with your Meilisearch index, so the data in Meilisearch is a mirror of your content in Cloud Firestore. You can then run queries on this mirrored dataset.

Note that this extension only listens for changes to _documents_ in a specific collection, but not changes in any _subcollection_. However, you can install additional instances of this extension to listen to other collections in your Firestore database.

#### Additional setup

Before installing this extension, you'll need to:

- [Set up Cloud Firestore in your Firebase project](https://firebase.google.com/docs/firestore/quickstart)
- Run Meilisearch instance. There are many easy ways [to download and run a Meilisearch instance.](https://docs.meilisearch.com/learn/getting_started/installation.html#download-and-launch)

#### Data import format

Documents indexed in Meilisearch need to have a [unique id](https://docs.meilisearch.com/learn/core_concepts/documents.html#primary-field), to do so this extension will use the default field provided for this purpose in Firestore: `Document ID` which will be renamed `_firestore_id` used as [document id](https://docs.meilisearch.com/learn/core_concepts/documents.html#document-id). If your documents have an `id` field it will be added to your documents without it being your primary key.

**Important:**  If your document have a field `_firestore_id` it will be ignored.

[GeoSearch](https://docs.meilisearch.com/reference/features/geosearch.html#geosearch) has a specific format in Meilisearch, if a `GeoPoint` from Firestore with the name `_geo` is found the field `latitude` would renamed to `lat` and the field `longitude` to `lng`.
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




**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? If you need help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Collection path: What is the path of the collection you would like to export into Meilisearch?

* Fields to index in Meilisearch: What fields do you want to index in Meilisearch? Create a comma-separated list of the field names, or leave it blank to include all fields. The id field is always indexed even when omitted from the list.

* Fields in which to search. - Optional: What fields do you want to make searchable in Meilisearch? This feature is optional. See [the documentation for more details.](https://docs.meilisearch.com/reference/features/field_properties.html#searchable-fields) Create a comma-separated list of fields, or leave it blank to include all fields.

* Meilisearch Index Name: What Meilisearch index do you want to index your data in?

* Meilisearch host: What is the URL of the host of your Meilisearch database? Make sure your URL starts with `http://` or `https://`

* Meilisearch API key: What is your Meilisearch API key with permission to perform actions on indexes? Both the private key and the master key are valid choices but we strongly recommend using the private key for security purposes. Check out our guide on [authentification](https://dev.docs.meilisearch.com/reference/features/authentication.html#key-types).



**Cloud Functions:**

* **indexingWorker:** Cloud function triggered by document modification in Firestore to import changes into Meilisearch.

---

## 🧩 Install this extension

### Console

[![Install this extension in your Firebase project](https://www.gstatic.com/mobilesdk/210513_mobilesdk/install-extension.png "Install this extension in your Firebase project")][install-link]

[install-link]: https://console.firebase.google.com/project/_/extensions/install?ref=publisher_id/extension_name

### Firebase CLI

```bash
firebase ext:install meilisearch/firestore-meilisearch --project=[your-project-id]
```

> Learn more about installing extensions in the Firebase Extensions documentation:
> [console](https://firebase.google.com/docs/extensions/install-extensions?platform=console),
> [CLI](https://firebase.google.com/docs/extensions/install-extensions?platform=cli)

---

## ⚙️ Development Workflow and Contributing

Any new contribution is more than welcome in this project!

If you want to know more about the development workflow or wish to contribute, please see our [contributing guidelines](/CONTRIBUTING.md) for detailed instructions!

<hr>

**Meilisearch** provides and maintains many **SDKs and Integration tools** like this one. We want to provide everyone with an **amazing search experience for any kind of project**. If you wish to contribute, make suggestions, or want to know what's going on right now, visit the [integration-guides](https://github.com/meilisearch/integration-guides) repository.

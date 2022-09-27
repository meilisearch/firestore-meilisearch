/**
 * Validate if the format of the document id is compliant with Meilisearch.
 * Based on this documentation: https://docs.meilisearch.com/learn/core_concepts/primary_key.html#formatting-the-document-id
 *
 * @param  {string} documentId Document id.
 *
 * @return {boolean} - Wether the document id is properly formatted (true) or not.
 */
export function validateDocumentId(documentId: string) {
  const wrongChars = documentId.search(/([^a-zA-Z0-9-_]+)/)

  return wrongChars === -1
}

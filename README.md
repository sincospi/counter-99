# counter-99

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/counter-99)

# Firebase

This app uses firebase for it's backend.

More specifically, it uses the following modules:

- Authentication
- Firestore

## Firestore

The following firestore rule is defined within firestore. It allows public reads but prevents mutation to logged in users. Hence anyone can create new sessions. Only session owners can edit a session.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Collection named "sessions"
    match /sessions/{sessionId} {
      // Allow public read access to all documents in the "session" collection
      allow read: if true;

      // Allow document creation for all authenticated users
      allow create: if request.auth != null;

      // Limit update and delete access to the signed-in owner of the document
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.created_by.uuid;
    }
  }
}
```
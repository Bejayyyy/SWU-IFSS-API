# SWU-IFSS API documentation

Standalone interactive documentation for the Firebase callable functions in `../functions/index.js`.

## Run locally

From this folder:

```bash
npm install
npm run dev
```

The root repository already uses the same Vite version, so `npm run dev --prefix api` also works when dependencies are installed at the repository root.

## Build

```bash
npm run build
```

The deployable static files are generated in `api/dist` and are independent of the main SWU-IFSS frontend build.

## Calling Firebase functions

These are Firebase HTTPS callable functions, not ordinary REST handlers. The documentation client sends request values inside the required `{ "data": ... }` envelope. For protected functions, open **Authorize** and provide a Firebase ID token. Add an App Check token when enforcement is enabled for the chosen endpoint.

The documentation intentionally excludes Firestore background triggers because they cannot be invoked directly over HTTP.

## Authentication documentation

SWU-IFSS does not expose a custom password-taking Cloud Function. User and administrator login both use Firebase Authentication. After sign-in, the main application loads the user's Firestore profile and checks that the account is active and that its role is allowed to enter the requested application area.

The `user-auth` and `admin-auth` sections document the underlying Firebase Identity Toolkit endpoints. To execute those examples, enter the project's Firebase Web API key in the documentation toolbar. Never paste a user's password into a shared or untrusted deployment of the documentation.

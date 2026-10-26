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

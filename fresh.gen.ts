// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_generate_documents from "./routes/api/generate-documents.ts";
import * as $api_generate from "./routes/api/generate.ts";
import * as $api_test_storage from "./routes/api/test-storage.ts";
import * as $index from "./routes/index.tsx";
import * as $DocumentGeneratorIsland from "./islands/DocumentGeneratorIsland.tsx";
import * as $FileUploadIsland from "./islands/FileUploadIsland.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/generate-documents.ts": $api_generate_documents,
    "./routes/api/generate.ts": $api_generate,
    "./routes/api/test-storage.ts": $api_test_storage,
    "./routes/index.tsx": $index,
  },
  islands: {
    "./islands/DocumentGeneratorIsland.tsx": $DocumentGeneratorIsland,
    "./islands/FileUploadIsland.tsx": $FileUploadIsland,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;

import { Head } from "$fresh/runtime.ts";
import DocumentGeneratorIsland from "../islands/DocumentGeneratorIsland.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Document Generator</title>
        <meta name="description" content="Generate multiple documents from Excel data and Word templates" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div class="container mx-auto px-4">
        <main class="main-content">
          <DocumentGeneratorIsland />
        </main>
      </div>
    </>
  );
}
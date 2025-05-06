// routes/api/generate.ts
import { HandlerContext } from "$fresh/server.ts";
// Try importing from esm.sh - make sure to use specific versions for stability
// Check for the latest compatible versions on esm.sh
import * as XLSX from "https://esm.sh/xlsx@0.18.5";
import PizZip from "https://esm.sh/pizzip@3.1.4"; // PizZip might be a default export
import Docxtemplater from "https://esm.sh/docxtemplater@3.37.10"; // Docxtemplater might be a default export

// If the default export doesn't work for PizZip, you might need to inspect its structure:
// import * as PizZipModule from "https://esm.sh/pizzip@3.1.4";
// const PizZip = PizZipModule.default || PizZipModule; // or whatever the actual export is

// Similarly for Docxtemplater if the default import doesn't work.

export const handler = async (req: Request, _ctx: HandlerContext): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const formData = await req.formData();
    const excelFile = formData.get("excel") as File | null; // Ensure it can be null
    const wordFile = formData.get("word") as File | null;   // Ensure it can be null
    const prefix = formData.get("prefix") as string || "{{";
    const suffix = formData.get("suffix") as string || "}}";

    if (!excelFile || !wordFile) {
      return new Response(JSON.stringify({ error: "Missing Excel or Word file." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Read Excel data
    const excelBuffer = await excelFile.arrayBuffer();
    // Note: XLSX.read might expect a Buffer in Node, but Uint8Array is standard here
    const workbook = XLSX.read(new Uint8Array(excelBuffer), { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const data: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet);

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ error: "No data found in Excel file." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Read Word template
    const templateBuffer = await wordFile.arrayBuffer();

    // Use PizZip. PizZip constructor is usually the default export.
    const inputZip = new PizZip(templateBuffer);
    
    // Create zip for output using PizZip
    const outputZip = new PizZip();

    // Generate a document for each row
    for (let i = 0; i < data.length; i++) {
      const rowData = data[i];
      // Create a new Docxtemplater instance for each document to avoid state issues
      // Pass the PizZip instance of the template
      const doc = new Docxtemplater(new PizZip(templateBuffer), { // Re-instance PizZip for template for safety
        paragraphLoop: true,
        linebreaks: true,
        delimiters: {
          start: prefix,
          end: suffix,
        },
        // You might not need to specify an XML parser if running in an environment
        // that provides one (like Deno, which has DOMParser globally)
        // If you encounter XML parsing issues, you might need to explicitly provide one
        // that works with docxtemplater and Deno's environment.
      });

      doc.setData(rowData);
      
      try {
        doc.render(); // Render the document
      } catch (error) {
        console.error(`Error rendering document for row ${i}:`, error);
        // Decide how to handle: skip this doc, or error out entirely?
        // For now, let's add a text file indicating the error for this specific document.
        outputZip.file(`error_document_${i + 1}.txt`, `Failed to generate document for row ${i+1}. Error: ${error.message}\nData: ${JSON.stringify(rowData)}`);
        continue; // Continue to the next document
      }

      const generatedDocBuffer = doc.getZip().generate({
        type: "uint8array", // Deno works well with Uint8Array
        compression: "DEFLATE",
      });

      // Add to output zip file with unique name
      // Ensure filenames are sanitized if they come from data
      outputZip.file(`document_${i + 1}.docx`, generatedDocBuffer);
    }

    if (Object.keys(outputZip.files).length === 0) {
         return new Response(JSON.stringify({ error: "No documents were generated. Check for rendering errors." }), {
           status: 500,
           headers: { "Content-Type": "application/json" },
         });
    }

    const zipContent = outputZip.generate({
      type: "uint8array",
      compression: "DEFLATE",
    });

    return new Response(zipContent, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="generated_documents_${Date.now()}.zip"`,
      },
    });

  } catch (error) {
    console.error("Error generating documents:", error);
    return new Response(JSON.stringify({ error: `An error occurred: ${error.message || "Unknown error"}` }), { 
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
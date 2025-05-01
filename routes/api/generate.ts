import { HandlerContext } from "$fresh/server.ts";
import * as XLSX from "xlsx";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export const handler = async (req: Request, _ctx: HandlerContext): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const formData = await req.formData();
    const excelFile = formData.get("excel") as File;
    const wordFile = formData.get("word") as File;
    const prefix = formData.get("prefix") as string || "{{";
    const suffix = formData.get("suffix") as string || "}}";

    if (!excelFile || !wordFile) {
      return new Response("Missing files", { status: 400 });
    }

    // Read Excel data
    const excelBuffer = await excelFile.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(excelBuffer), { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Read Word template
    const templateBuffer = await wordFile.arrayBuffer();
    const zip = new PizZip(templateBuffer);
    
    // Create zip for output
    const outputZip = new PizZip();

    // Generate a document for each row
    for (let i = 0; i < data.length; i++) {
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: {
          start: prefix,
          end: suffix,
        },
      });

      // Replace template variables with data
      doc.setData(data[i]);
      doc.render();

      // Get the generated document
      const generatedDoc = doc.getZip().generate({
        type: "uint8array",
        compression: "DEFLATE",
      });

      // Add to zip file with unique name
      outputZip.file(`document_${i + 1}.docx`, generatedDoc);
    }

    // Generate final zip file
    const zipContent = outputZip.generate({
      type: "uint8array",
      compression: "DEFLATE",
    });

    return new Response(zipContent, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=generated_documents.zip",
      },
    });

  } catch (error) {
    console.error("Error generating documents:", error);
    return new Response(JSON.stringify({ error: "An error occurred while generating documents. Please try again later." }), { 
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
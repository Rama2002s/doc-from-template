// routes/api/generate-documents.ts
import { generateDocuments } from "../../utils/documentGenerator.ts";

export const handler = async (req: Request): Promise<Response> => {
  try {
    const formData = await req.formData();
    const templateFile = formData.get("template") as File;
    const dataFile = formData.get("data") as File;
    const outputFormat = formData.get("format") as string || "docx";

    if (!templateFile || !dataFile) {
      throw new Error("Missing required files");
    }

    const result = await generateDocuments({
      templateFile,
      dataFile,
      outputFormat
    });

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
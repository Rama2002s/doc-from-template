// routes/api/generate.ts
import { generateDocuments } from "../../utils/documentGenerator.ts";

export const handler = async (req: Request): Promise<Response> => {
  try {
    const formData = await req.formData();
    const excel = formData.get("excel") as File;
    const word = formData.get("word") as File;
    const prefix = formData.get("prefix") as string;
    const suffix = formData.get("suffix") as string;

    if (!excel || !word || !prefix || !suffix) {
      throw new Error("Missing required files or placeholder format");
    }

    const generatedDoc = await generateDocuments({
      excel,
      word,
      prefix,
      suffix,
    });

    // Return the generated document
    return new Response(generatedDoc, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="generated_document.docx"`,
      },
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
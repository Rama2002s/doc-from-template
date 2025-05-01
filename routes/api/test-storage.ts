// routes/api/test-storage.ts
import { uploadFile, getFile } from "../../utils/storage.ts";

export async function handler(req: Request): Promise<Response> {
  try {
    // Create a simple test file
    const testContent = "Hello, this is a test file!";
    const testFile = new File(
      [testContent], 
      "test.txt", 
      { type: "text/plain" }
    );

    // Test upload
    console.log("Testing upload...");
    const fileId = await uploadFile(testFile);
    console.log("File uploaded with ID:", fileId);

    // Test download
    console.log("Testing download...");
    const downloadedFile = await getFile(fileId);
    const decoder = new TextDecoder();
    const downloadedContent = decoder.decode(downloadedFile.data);
    
    return new Response(JSON.stringify({
      success: true,
      fileId,
      originalContent: testContent,
      downloadedContent,
      metadata: downloadedFile.metadata,
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Test failed:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
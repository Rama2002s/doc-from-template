// utils/documentGenerator.ts
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs";
import Docxtemplater from "npm:docxtemplater";
import PizZip from "npm:pizzip";

interface GenerateParams {
  excel: File;
  word: File;
  prefix: string;
  suffix: string;
}

export async function generateDocuments(params: GenerateParams): Promise<Uint8Array> {
  try {
    // Read Excel file
    const excelBuffer = await params.excel.arrayBuffer();
    const excelData = await readExcelData(new Uint8Array(excelBuffer));

    // Read Word template
    const wordBuffer = await params.word.arrayBuffer();
    const template = await readWordTemplate(new Uint8Array(wordBuffer));

    // Generate documents using the placeholder format
    const generatedDocs = await generateFromTemplate(template, excelData, {
      prefix: params.prefix,
      suffix: params.suffix,
    });

    return generatedDocs;
  } catch (error) {
    throw new Error(`Document generation failed: ${error.message}`);
  }
}

async function readExcelData(data: Uint8Array) {
  try {
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    throw new Error(`Excel processing failed: ${error.message}`);
  }
}

async function readWordTemplate(data: Uint8Array) {
  try {
    return new PizZip(data);
  } catch (error) {
    throw new Error(`Word template processing failed: ${error.message}`);
  }
}

async function generateFromTemplate(
  template: any, 
  data: any[], 
  placeholders: { prefix: string; suffix: string }
) {
  try {
    const doc = new Docxtemplater(template, {
      delimiters: {
        start: placeholders.prefix,
        end: placeholders.suffix,
      },
    });

    // Generate a document for each row of data
    const generatedDocs = await Promise.all(
      data.map(async (row) => {
        doc.setData(row);
        doc.render();
        return doc.getZip().generate({
          type: 'uint8array',
          compression: "DEFLATE"
        });
      })
    );

    // For now, return the first document
    // Later we can implement ZIP functionality for multiple documents
    return generatedDocs[0];
  } catch (error) {
    throw new Error(`Template processing failed: ${error.message}`);
  }
}
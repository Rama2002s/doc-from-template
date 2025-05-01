export const EXCEL_MIME_TYPES = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  
  export const WORD_MIME_TYPES = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  
  export function isExcelFile(file: File): boolean {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isValidExtension = extension === 'xlsx' || extension === 'xls';
    const isValidMimeType = EXCEL_MIME_TYPES.includes(file.type);
    return isValidExtension && isValidMimeType;
  }
  
  export function isWordFile(file: File): boolean {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isValidExtension = extension === 'docx' || extension === 'doc';
    const isValidMimeType = WORD_MIME_TYPES.includes(file.type);
    return isValidExtension && isValidMimeType;
  }
// islands/DocumentGeneratorIsland.tsx
import { useState } from "preact/hooks";
import FileUploadIsland from "./FileUploadIsland.tsx";
import PlaceholderSettings from "../components/PlaceholderSettings.tsx";

interface FileState {
  excel: File | null;
  word: File | null;
}

interface FileErrorState {
  excel: string | null;
  word: string | null;
}

const PLACEHOLDER_FORMATS = [
  { value: "curly", label: "{{placeholder}}", prefix: "{{", suffix: "}}" },
  { value: "square", label: "[placeholder]", prefix: "[", suffix: "]" },
  { value: "angle", label: "<placeholder>", prefix: "<", suffix: ">" },
  { value: "dollar", label: "$(placeholder)", prefix: "$(", suffix: ")" },
];

const EXCEL_TYPE = {
  accept: [
    '.xls',
    '.xlsx',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  label: 'Excel (.xls, .xlsx)',
};

const WORD_TYPE = {
  accept: [
    '.doc',
    '.docx',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  label: 'Word (.doc, .docx)',
};

export default function DocumentGeneratorIsland() {
  const [files, setFiles] = useState<FileState>({
    excel: null,
    word: null,
  });
  const [fileErrors, setFileErrors] = useState<FileErrorState>({
    excel: null,
    word: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [format, setFormat] = useState("curly");

  const handleExcelFile = (file: File) => {
    setFiles(prev => ({ ...prev, excel: file }));
    setFileErrors(prev => ({ ...prev, excel: null }));
  };

  const handleWordFile = (file: File) => {
    setFiles(prev => ({ ...prev, word: file }));
    setFileErrors(prev => ({ ...prev, word: null }));
  };

const handleGenerate = async () => {
  if (!files.excel || !files.word) {
    setError('Please upload both Excel and Word files');
    return;
  }

  const selectedFormat = PLACEHOLDER_FORMATS.find(f => f.value === format);
  if (!selectedFormat) {
    setError('Invalid placeholder format');
    return;
  }

  setIsGenerating(true);
  setError(null);

  const formData = new FormData();
  formData.append('excel', files.excel);
  formData.append('word', files.word);
  formData.append('prefix', selectedFormat.prefix);
  formData.append('suffix', selectedFormat.suffix);

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to generate documents. Please try again.'; // Default error
      try {
        // Check if the response is JSON, as our API intends
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          } else {
            // Fallback if JSON is malformed or doesn't have an error field
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
        } else {
          // If not JSON, try to get text (e.g., for unexpected server errors like HTML error pages)
          errorMessage = await response.text() || `Server error: ${response.status} ${response.statusText}`;
        }
      } catch (e) {
        // Catch errors during error parsing itself (e.g., response.json() fails)
        console.error("Error parsing error response:", e);
        errorMessage = `Failed to parse server error response. Status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Attempt to get filename from Content-Disposition header
    let downloadFilename = 'generated_documents.zip'; // Default filename
    const disposition = response.headers.get('Content-Disposition');
    if (disposition && disposition.includes('attachment')) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        downloadFilename = matches[1].replace(/['"]/g, '');
      }
    }
    a.download = downloadFilename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Clean up the anchor element
    window.URL.revokeObjectURL(url); // Clean up the object URL

  } catch (error) {
    console.error('Client-side error or API error:', error);
    setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
  } finally {
    setIsGenerating(false);
  }
};


  return (
    <div class="min-h-screen bg-gray-50 py-12 px-6 sm:px-8 lg:px-10 flex justify-center">
      <div class="w-full max-w-4xl">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Document Generator
          </h1>
          <p class="text-xl text-gray-600">
            Generate multiple documents from Excel data and Word templates
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Excel Upload Container */}
          <div class="flex flex-col gap-4">
            <FileUploadIsland
              onFileSelect={handleExcelFile}
              acceptedFileTypes={EXCEL_TYPE.accept}
              maxSizeInMB={10}
              title="Excel Data File"
            />
            {files.excel && (
              <div class="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg">
                <svg 
                  class="w-5 h-5 text-green-500" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fill-rule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm font-medium truncate">
                  {files.excel.name}
                </span>
              </div>
            )}
          </div>

          {/* Word Upload Container */}
          <div class="flex flex-col gap-4">
            <FileUploadIsland
              onFileSelect={handleWordFile}
              acceptedFileTypes={WORD_TYPE.accept}
              maxSizeInMB={10}
              title="Word Template"
            />
            {files.word && (
              <div class="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg">
                <svg 
                  class="w-5 h-5 text-green-500" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fill-rule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm font-medium truncate">
                  {files.word.name}
                </span>
              </div>
            )}
          </div>
        </div>

        <div class="mb-12">
          <PlaceholderSettings
            format={format}
            onFormatChange={setFormat}
            formats={PLACEHOLDER_FORMATS}
          />
        </div>

        {error && (
          <div class="mb-8 px-4 py-3 bg-red-50 text-red-700 rounded-lg">
            <div class="flex items-center gap-2">
              <svg 
                class="w-5 h-5 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={!files.excel || !files.word || isGenerating}
          class={`
            w-full py-4 px-6 rounded-xl font-semibold text-lg
            transition-all duration-200
            ${isGenerating || !files.excel || !files.word
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 active:transform active:scale-[0.99]'
            }
            ${isGenerating ? 'flex items-center justify-center gap-3' : ''}
          `}
        >
          {isGenerating && (
            <svg 
              class="animate-spin h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                class="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                class="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {isGenerating ? 'Generating Documents...' : 'Generate Documents'}
        </button>
      </div>
    </div>
  );
} 
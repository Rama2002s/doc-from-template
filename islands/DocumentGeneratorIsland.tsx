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

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const WORD_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

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
        throw new Error(await response.text());
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated_documents.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate documents');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div class="page-wrapper">
      <div class="container">
        <h1 class="page-title">
          Document Generator
        </h1>
        <p class="page-subtitle">
          Generate multiple documents from Excel data and Word templates
        </p>

        <div class="upload-section">
          {/* Excel Upload Container */}
          <div class="upload-container">
            <FileUploadIsland
              onFileSelect={handleExcelFile}
              acceptedFileTypes={[EXCEL_TYPE]}
              maxSizeInMB={10}
              title="Excel Data File"
            />
            {files.excel && (
              <p class="file-success">
                <svg class="success-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                {files.excel.name}
              </p>
            )}
          </div>

          {/* Word Upload Container */}
          <div class="upload-container">
            <FileUploadIsland
              onFileSelect={handleWordFile}
              acceptedFileTypes={[WORD_TYPE]}
              maxSizeInMB={10}
              title="Word Template"
            />
            {files.word && (
              <p class="file-success">
                <svg class="success-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                {files.word.name}
              </p>
            )}
          </div>
        </div>

        <div class="settings-panel">
          <PlaceholderSettings
            format={format}
            onFormatChange={setFormat}
            formats={PLACEHOLDER_FORMATS}
          />
        </div>

        {error && (
          <div class="error-message">
            {error}
          </div>
        )}

        <button
          class={`generate-button ${
            isGenerating || !files.excel || !files.word
              ? 'generate-button-disabled'
              : 'generate-button-enabled'
          }`}
          onClick={handleGenerate}
          disabled={!files.excel || !files.word || isGenerating}
        >
          {isGenerating ? 'Generating Documents...' : 'Generate Documents'}
        </button>
      </div>
    </div>
  );
}
// components/FileUploadBox.tsx
interface FileUploadBoxProps {
    acceptedFileTypes: string[];
    uploadStatus?: 'idle' | 'uploading' | 'success' | 'error';
    errorMessage?: string;
    title: string;
  }
  
  export function FileUploadBox({ 
    acceptedFileTypes, 
    uploadStatus = 'idle',
    errorMessage,
    title
  }: FileUploadBoxProps) {
    return (
      <div>
        <h3 class="text-white text-lg font-semibold mb-4">{title}</h3>
        <div class="upload-box">
          <svg
            class="upload-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          
          <p class="upload-text">
            Drag & Drop to Upload File
          </p>
          <p class="upload-subtext">OR</p>
          
          {/* Remove the native file input display and only show our custom button */}
          <button class="browse-button">
            Browse File
          </button>
          
          {uploadStatus === 'error' && errorMessage && (
            <p class="upload-status-error">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    );
  }
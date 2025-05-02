  // components/FileUploadBox.tsx
interface FileType {
  mime: string;
  label: string;
}

interface FileUploadBoxProps {
  acceptedFileTypes: FileType[];
  uploadStatus?: 'idle' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
  title: string;
  isDragging?: boolean;
}

export function FileUploadBox({ 
  acceptedFileTypes, 
  uploadStatus = 'idle',
  errorMessage,
  title,
  isDragging,
}: FileUploadBoxProps) {
  // Modernize accept label display for extensions and MIME
  const acceptLabel = acceptedFileTypes
  .filter(type => typeof type === 'string' && type.startsWith('.'))
  .join(', ');

  return (
    <div class="flex flex-col gap-4 w-full">
      <h3 class="text-2xl font-bold text-gray-800 mb-2 text-center">{title}</h3>
      <div
        class={`relative flex flex-col items-center p-8 rounded-2xl bg-white border-2 border-dashed transition-all duration-300 ease-in-out w-full max-w-lg mx-auto shadow-md
        ${uploadStatus === 'error' ? 'border-red-400' : isDragging ? 'border-blue-500 bg-blue-50' : 'border-purple-400'}
        hover:border-purple-600 hover:shadow-lg
        `}
      >
        <div class={`p-4 rounded-full bg-purple-100 mb-4 transition-transform duration-300 ${isDragging ? 'scale-110 bg-blue-200' : ''}`}>
          <svg
            class="w-10 h-10 text-purple-600"
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
        </div>
        <p class="text-base text-gray-700 font-medium mb-2 text-center">
          <span class="block">Upload or drag your file here</span>
          <span class="text-xs text-gray-400">({acceptLabel} files only)</span>
        </p>

        {uploadStatus === 'error' && errorMessage && (
            <p class="mt-4 text-red-500 text-sm">
              {errorMessage}
            </p>
          )}
          
          {uploadStatus === 'success' && (
            <div class="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div class="text-green-500 flex items-center gap-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>File uploaded successfully!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
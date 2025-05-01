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
  }: FileUploadBoxProps) {
    return (
      <div class="flex flex-col gap-4">
        <h3 class="text-2xl font-semibold text-gray-800">{title}</h3>
        <div class={`
          relative
          p-8
          rounded-xl
          bg-white
          border-2 border-dashed
          transition-all duration-300 ease-in-out
          ${uploadStatus === 'error' ? 'border-red-400' : 'border-purple-400'}
          hover:border-purple-600
          flex flex-col items-center
          shadow-sm hover:shadow-md
        `}>
          <div class={`
            p-4 rounded-full
            bg-purple-100 
            mb-4
            transition-transform duration-300
            group-hover:scale-110
          `}>
            <svg
              class="w-8 h-8 text-purple-600"
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
          
          <p class="text-lg text-gray-700 font-medium mb-2">
            Drag & Drop to Upload File
          </p>
          
          <p class="text-sm text-gray-500 mb-4">
            {acceptedFileTypes.map(type => type.label).join(' or ')} files only
          </p>
          
          <div class="flex items-center gap-2">
            <span class="text-gray-400">OR</span>
          </div>
          
          <button class={`
            mt-4
            px-6 py-2
            bg-purple-600
            text-white
            rounded-lg
            font-medium
            transition-all duration-200
            hover:bg-purple-700
            hover:shadow-lg
            active:transform active:scale-95
          `}>
            Browse File
          </button>
          
          {uploadStatus === 'uploading' && (
            <div class="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          )}
          
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
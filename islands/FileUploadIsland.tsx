// islands/FileUploadIsland.tsx
import { useSignal } from "@preact/signals";
import { FileUploadBox } from "../components/FileUploadBox.tsx";

interface FileUploadIslandProps {
  onFileSelect: (file: File) => void;
  maxSizeInMB?: number;
  acceptedFileTypes: string[];
  title: string;  // Added title prop
}

export default function FileUploadIsland({ 
  onFileSelect, 
  maxSizeInMB = 10,
  acceptedFileTypes,
  title
}: FileUploadIslandProps) {
  const uploadStatus = useSignal<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const errorMessage = useSignal<string>('');
  const inputId = `fileInput-${title.replace(/\s+/g, '')}`;  // Generate unique ID for each input

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add visual feedback for drag over
    const uploadBox = (e.currentTarget as HTMLElement).querySelector('.upload-box');
    if (uploadBox) {
      uploadBox.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Remove visual feedback
    const uploadBox = (e.currentTarget as HTMLElement).querySelector('.upload-box');
    if (uploadBox) {
      uploadBox.classList.remove('drag-over');
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove visual feedback
    const uploadBox = (e.currentTarget as HTMLElement).querySelector('.upload-box');
    if (uploadBox) {
      uploadBox.classList.remove('drag-over');
    }
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleFileInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      validateAndProcessFile(input.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Reset status
    uploadStatus.value = 'idle';
    errorMessage.value = '';

    // Validate file type
    if (!acceptedFileTypes.includes(file.type)) {
      uploadStatus.value = 'error';
      errorMessage.value = 'Invalid file type. Please upload a supported file.';
      return;
    }

    // Validate file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      uploadStatus.value = 'error';
      errorMessage.value = `File size exceeds ${maxSizeInMB}MB limit.`;
      return;
    }

    try {
      // Process valid file
      uploadStatus.value = 'uploading';
      onFileSelect(file);
      uploadStatus.value = 'success';
    } catch (error) {
      uploadStatus.value = 'error';
      errorMessage.value = 'An error occurred while processing the file.';
    }
  };

  const handleClick = () => {
    document.getElementById(inputId)?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      class="cursor-pointer"
    >
      <input
        id={inputId}
        type="file"
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileInput}
        style="display: none"
      />
      <FileUploadBox
        acceptedFileTypes={acceptedFileTypes}
        uploadStatus={uploadStatus.value}
        errorMessage={errorMessage.value}
        title={title}
      />
    </div>
  );
}
// islands/FileUploadIsland.tsx
import { useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import { FileUploadBox } from "../components/FileUploadBox.tsx";

interface FileUploadIslandProps {
  onFileSelect: (file: File) => void;
  maxSizeInMB?: number;
  acceptedFileTypes: string[];
  title: string;
}

export default function FileUploadIsland({ 
  onFileSelect, 
  maxSizeInMB = 10,
  acceptedFileTypes,
  title
}: FileUploadIslandProps) {
  const uploadStatus = useSignal<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const errorMessage = useSignal<string>('');
  const isDragging = useSignal<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = `fileInput-${title.replace(/\s+/g, '')}`;

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.value = true;
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.value = false;
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.value = false;
    
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
    uploadStatus.value = 'idle';
    errorMessage.value = '';
  
    // Validate file type
    const validMimeTypes = acceptedFileTypes.map(type => type.mime);
    if (!validMimeTypes.includes(file.type)) {
      uploadStatus.value = 'error';
      errorMessage.value = `Invalid file type. Please upload ${acceptedFileTypes.map(type => type.label).join(' or ')} file.`;
      return;
    }
  
    // Validate file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      uploadStatus.value = 'error';
      errorMessage.value = `File size exceeds ${maxSizeInMB}MB limit.`;
      return;
    }
  
    try {
      uploadStatus.value = 'uploading';
      onFileSelect(file);
      uploadStatus.value = 'success';
    } catch (error) {
      uploadStatus.value = 'error';
      errorMessage.value = 'An error occurred while processing the file.';
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      class="cursor-pointer transition-all duration-200 hover:opacity-95"
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileInput}
        class="hidden"
      />
      <FileUploadBox
        acceptedFileTypes={acceptedFileTypes}
        uploadStatus={uploadStatus.value}
        errorMessage={errorMessage.value}
        title={title}
        isDragging={isDragging.value}
      />
    </div>
  );
}
import React, { useRef, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { FaCloudUploadAlt } from 'react-icons/fa';
import useCsvConnection from 'hooks/harbor/useCsvConnection';
import { ModalWrapper } from 'components/modal/ModalWrapper';
import ModalButtons from 'components/modal/ModalButtons';

interface HarborCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HarborCustomModal: React.FC<HarborCustomModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileTooLarge, setFileTooLarge] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    if (fileInput.current && fileInput.current.files) {
      const files = Array.from(fileInput.current.files);
      const anyFileTooLarge = files.some(file => file.size > 1048576); // Files larger than 1MB
      setFileTooLarge(anyFileTooLarge);
      if (!anyFileTooLarge) {
        setUploadedFiles(prevFiles => [...prevFiles, ...files]);
      }
    }
  };

  const handleFileDelete = (index: number) => {
    setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    if (uploadedFiles[index].size > 1048576) {
      setFileTooLarge(false);
    }
  };

  const {
    uploadStatus,
    errorMessage,
    uploadProgress,
    setUploadStatus,
    setErrorMessage,
    setUploadProgress,
    isUploading,
    saveFiles,
  } = useCsvConnection();

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}
      title={'Upload Spreadsheet'}
      className='h-auto sm:w-full sm:max-w-sm'
    >
      {fileTooLarge && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-4" role="alert">
          <p>One or more files exceed the 1MB size limit. Please choose smaller files.</p>
          <p>Contact <a href="mailto:support@structuredlabs.io" className="underline">support@structuredlabs.io</a> to unlock larger uploads.</p>
        </div>
      )}
      {uploadedFiles.length > 0 && (
        uploadedFiles.map((file, index) => (
          <div
            key={index}
            className='flex flex-row items-center justify-between border border-gray-300 rounded-md p-4 my-4'
          >
            <span>{file.name}</span>
            <IoMdClose className={`text-sm ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => {
                if (isUploading) return;
                handleFileDelete(index)
              }}
            />
          </div>
        ))
      )}
      <label
        className='flex flex-col items-center justify-center p-4 my-4 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500'
        htmlFor="file-upload"
      >
        <FaCloudUploadAlt className='w-6 h-6' />
        <span className='mt-2'>Local Filesystem</span>
        <input
          id="file-upload"
          ref={fileInput}
          type="file"
          multiple={true}
          className='hidden'
          onChange={handleFileUpload}
          accept=".csv"
        />
      </label>
      <ModalButtons
        onClose={onClose}
        handleConnect={async () => {
          if (!fileTooLarge) {
            await saveFiles(uploadedFiles);
            setUploadedFiles([]);
            onClose();
          }
        }}
        loading={isUploading || fileTooLarge}
        loadingText={
          fileTooLarge ? 'Files too large' : isUploading ? 'Uploading...' : 'Loading...'
        }
      />
    </ModalWrapper>
  );
};

export default HarborCustomModal;

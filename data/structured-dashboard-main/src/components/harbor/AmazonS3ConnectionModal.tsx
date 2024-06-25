import { useState } from 'react';
import React from 'react';
import useAmazonS3Connection from 'hooks/harbor/useAmazonS3Connection';
import ModalInputBox from 'components/modal/ModalInputBox';
import {ModalWrapper} from 'components/modal/ModalWrapper';
import ModalButtons from 'components/modal/ModalButtons';

interface AmazonS3ConnectionCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AmazonS3ConnectionCustomModal: React.FC<AmazonS3ConnectionCustomModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [accessKeyID, setAccessKeyID] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [bucketName, setBucketName] = useState('');
  const [fileName, setFileName] = useState('');
  const [region, setRegion] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const { addAmazonS3BucketDetailsToDB, isConnecting, errorMessage } = useAmazonS3Connection();

  const clearInputs = () => {
    // setAccessKeyID('');
    // setSecretAccessKey('');
    // setBucketName('');
    // setRegion('');
    // setFileName('');
  }

  const handleConnect = async () => {
    if (validateInputs()) {
      setShowAlert(false);
      clearInputs();
      try {
        const res = await addAmazonS3BucketDetailsToDB(accessKeyID, secretAccessKey, bucketName, fileName, region);
        if (res) {
          onClose();
        }
      } catch (error) {
        console.error('Error connecting to Amazon S3', error);
        setAlertMsg('Failed to connect to Amazon S3');
        setShowAlert(true);
      }
    } else {
      setShowAlert(true);
    }
  };

  const validateInputs = () => {
    // try calling the validation functions and return true if all pass or else setAlertMsg with the error message and return false
    try {
      validateAccessKeyID(accessKeyID);
      validateBucketName(bucketName);
      validateRegion(region);
      if (!validateFileName(fileName)) {
        throw new Error("Invalid file name format. Please ensure the file name is valid. Ex: path/filekey/filen-name.xlsx");
      }
      return true;
    } catch (error) {
      if (error instanceof Error) {
        setAlertMsg(error.message);
      } else {
        setAlertMsg("An error occurred during validation.");
      }
      return false;
    }
  };

  const validateAccessKeyID = (accessKey: string): boolean => {
    // Regular expression for valid access key patterns (length 20, alphanumeric + underscore + hyphen)
    const accessKeyRegex = /^[a-zA-Z0-9_-]+$/;
    if (!accessKeyRegex.test(accessKey) || accessKey.length !== 20) {
      throw new Error("Invalid access key ID format. It must be 20 characters long and contain only alphanumeric characters, underscores, or hyphens.");
    }
    return true;
  };

  const validateBucketName = (bucketName: string): boolean => {
    // Regular expression for valid bucket name patterns (length 3-63, lowercase alphanumeric + dots + hyphens)
    const bucketNameRegex = /^[a-z0-9.-]{3,63}$/;
    if (!bucketNameRegex.test(bucketName)) {
      throw new Error("Invalid bucket name format. It must be 3-63 characters long and contain only lowercase alphanumeric characters, dots, or hyphens.");
    }
    return true;
  };

  const validateRegion = (region: string): boolean => {
    // List of valid AWS regions 
    // Can also use `npm install aws-regions` and import the list of regions from there
    const validRegions = [
      "us-east-1",
      "us-east-2",
      "us-west-1",
      "us-west-2",
      "ap-south-1",
      "ap-northeast-1",
      "ap-northeast-2",
      "ap-southeast-1",
      "ap-southeast-2",
      "ca-central-1",
      "eu-central-1",
      "eu-west-1",
      "eu-west-2",
      "eu-west-3",
      "sa-east-1",
    ];

    if (!validRegions.includes(region)) {
      throw new Error("Invalid region specified. Please ensure the region is a valid AWS region.");
    }

    return true;
  };

  const validateFileName = (fileName: string): boolean => {
    // Check if the filename is not empty.
    if (!fileName) return false;

    // Ensure the file name is not too long to prevent buffer overflow attacks.
    if (fileName.length > 1500) return false;

    // Disallow JavaScript file extensions to prevent XSS attacks if executed in a browser context.
    if (/\.(js|jsx|html|htm|php|asp|aspx|jsp)$/i.test(fileName)) return false;

    // Prevent execution bit to be set on upload if the system compiles it (Unix specific).
    if (/-executable$/i.test(fileName)) return false;

    // Avoid quotes to prevent breaking out of command-line arguments.
    if (/["']/g.test(fileName)) return false;

    // Avoid file names that could be interpreted as flags or options when executed.
    if (/^-/.test(fileName)) return false;

    // Disallow file names that refer to devices (Unix specific).
    if (/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i.test(fileName)) return false;

    // Disallow excessive extension spoofing (e.g., "name.jpg.exe").
    let extensionOccurrences = (fileName.match(/\./g) || []).length;
    if (extensionOccurrences > 1) return false;
    // Additional check for obfuscated extensions (e.g., "name.jpg[whitespace].exe").
    if (/\s+\.\w+$/i.test(fileName)) return false;

    // If all checks pass, return true.
    return true;
  };


  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={'Connect to Amazon S3'}
    >
      {/* Error Message */}
      {
        errorMessage && (
          <div className="mt-4">
            <p className="text-red-600">{errorMessage}</p>
          </div>
        )
      }
      {showAlert && (
        <div className="mt-4">
          <p className="text-red-600">{alertMsg}</p>
        </div>
      )}

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">

          <ModalInputBox
            title="Access Key ID"
            value={accessKeyID}
            onChange={(e) => setAccessKeyID(e.target.value)}
            placeholder=""
            disabled={isConnecting}
          />
          <ModalInputBox
            title="Secret Access Key"
            value={secretAccessKey}
            type="password"
            onChange={(e) => setSecretAccessKey(e.target.value)}
            placeholder=""
            disabled={isConnecting}

          />
          <ModalInputBox
            title="Bucket Name"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            placeholder=""
            disabled={isConnecting}
          />

          <ModalInputBox
            title="File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder=""
            disabled={isConnecting}
          />
          <ModalInputBox
            title="Region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder=""
            disabled={isConnecting}
          />
          <ModalButtons
            onClose={onClose}
            handleConnect={handleConnect}
            loading={isConnecting}
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AmazonS3ConnectionCustomModal;

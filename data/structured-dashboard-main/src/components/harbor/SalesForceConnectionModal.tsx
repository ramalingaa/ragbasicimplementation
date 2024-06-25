import React, { useRef, useState } from 'react';
import useSalesforceConnection from 'hooks/harbor/useSalesforceConnection';
import ModalInputBox from 'components/modal/ModalInputBox';
import ModalButtons from 'components/modal/ModalButtons';
import {ModalWrapper} from 'components/modal/ModalWrapper';
import Spinner from 'components/spinner/Spinner';

const SalesForceConnectionCustomModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [instanceUrl, setInstanceUrl] = useState('');
  const [apiVersion, setApiVersion] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [filename, setFilename] = useState('Account');
  const [showFilenameInput, setShowFilenameInput] = useState(false);
  const [salesforceImport, setSalesforceImport] = useState('Account');
  const [securityToken, setSecurityToken] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    saveSalesforceFile,
    uploadStatus,
    errorMessage,
    uploadProgress,
    setUploadStatus,
    setErrorMessage,
    setUploadProgress,
    saveSalesforceDetails,
    isUploading,
  } = useSalesforceConnection();

  const handleConnect = async () => {
    // TODO: Implement Salesforce variables validation checks
    const resp = await saveSalesforceFile({
      instanceUrl,
      apiVersion,
      clientId,
      clientSecret,
      username,
      password,
      filename,
      securityToken,
    });
    if (resp) {
      onClose();
    }
    setShowAlert(true);
  };

  const getFilesFromSalesforce = async () => {
    // TODO: Implement Salesforce variables validation checks
    const resp = await saveSalesforceDetails({
      instanceUrl,
      apiVersion,
      clientId,
      clientSecret,
      username,
      password,
      filename,
      securityToken,
      salesforceImport
    });
    if (resp) {
      onClose();
    }
    setShowAlert(true);
  };

  const overlayStyle: React.CSSProperties = {
    display: isOpen ? 'block' : 'none',
    position: 'fixed',
    zIndex: 10,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: '#fefefe',
    margin: '10% auto',
    width: '40%',
    border: '1px solid #888',
    borderRadius: '10px',
    zIndex: 11,
    padding: '20px',
    position: 'relative',
  };

  const handleSalesforceImportChange = (e: any) => {
    setSalesforceImport(e.target.value);
    if (e.target.value === 'fileUpload') {
      setShowFilenameInput(true);
    } else {
      setShowFilenameInput(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={'Connect to Salesforce'}
    >

      {isUploading && (
        <Spinner className='h-6 w-6 border-2' /> 
      )}
      <ModalInputBox
        title="Instance URL"
        value={instanceUrl}
        onChange={(e) => setInstanceUrl(e.target.value)}
        placeholder="https://login.salesforce.com"
        disabled={isUploading}
      />
      <ModalInputBox
        title="API Version"
        value={apiVersion}
        onChange={(e) => setApiVersion(e.target.value)}
        placeholder="53.0"
        disabled={isUploading}
      />
      <ModalInputBox
        title="Client ID"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        disabled={isUploading}
      />
      <ModalInputBox
        title="Client Secret"
        value={clientSecret}
        onChange={(e) => setClientSecret(e.target.value)}
        disabled={isUploading}
      />
      <ModalInputBox
        title="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={isUploading}
      />
      <ModalInputBox
        title="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        disabled={isUploading}
      />
      <ModalInputBox
        title="Security Token"
        value={securityToken}
        onChange={(e) => setSecurityToken(e.target.value)}
        disabled={isUploading}
      />

      <div className='mb-4'>
        <label htmlFor="Salesforce Import" className="block text-sm font-medium leading-6 text-gray-900">
          Salesforce Import
        </label>
        <select
          id="Salesforce Import"
          name="Salesforce Import"
          placeholder="Salesforce Import"
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={salesforceImport}
          onChange={handleSalesforceImportChange}
        >
          <option value="Account">Account</option>
          <option value="Contact">Contact</option>
          <option value="Lead">Lead</option>
          <option value="Campaign">Campaign</option>
          <option value="fileUpload">Provide Custom File name</option>
        </select>
      </div>

      {showFilenameInput && <ModalInputBox
        title="File Name"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        placeholder="Account"
        disabled={isUploading}
        className="mb-4"
      />}
      <ModalButtons
        onClose={onClose}
        handleConnect={showFilenameInput ? handleConnect : getFilesFromSalesforce}
      />
    </ModalWrapper>
  );
};

export default SalesForceConnectionCustomModal;

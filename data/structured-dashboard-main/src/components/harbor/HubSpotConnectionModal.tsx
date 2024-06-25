import React, { useState, useRef } from 'react';
import {ModalWrapper} from 'components/modal/ModalWrapper';
import ModalButtons from 'components/modal/ModalButtons';
import ModalInputBox from 'components/modal/ModalInputBox';
import useHubspotConnection, { HubspotConnectionFormInputs } from 'hooks/harbor/useHubspotConnection';

const HubSpotConnectionCustomModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [formInputs, setFormInputs] = useState<HubspotConnectionFormInputs>({
    apiKey: '',
    portalId: '',
  });

  const {
    uploadStatus,
    errorMessage,
    uploadProgress,
    setUploadStatus,
    setErrorMessage,
    setUploadProgress,
    isUploading,
    saveHubspotConnectionDetails,
  } = useHubspotConnection();

  const handleConnect = async () => {
    const success = await saveHubspotConnectionDetails(formInputs);
    if (success) {
      onClose();
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={'Connect to HubSpot'}
    >
      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
      <ModalInputBox
        title={'API Key'}
        value={formInputs.apiKey}
        onChange={(e) => setFormInputs({ ...formInputs, apiKey: e.target.value })}
        placeholder=""
        className='mt-2 mb-4'
      />
      {/* <ModalInputBox
        title={'Portal ID'}
        value={formInputs.portalId}
        onChange={(e) => setFormInputs({ ...formInputs, portalId: e.target.value })}
        placeholder="Enter your HubSpot Portal ID"
        className='mt-2 mb-4'
      /> */}
      <ModalButtons
        onClose={onClose}
        loading={isUploading}
        handleConnect={handleConnect}
      />
    </ModalWrapper>
  );
};

export default HubSpotConnectionCustomModal;

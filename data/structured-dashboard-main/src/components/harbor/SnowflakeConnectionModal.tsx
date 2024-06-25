import React, { useRef, useState } from 'react';
import useSnowflakeConnection, { SnowflakeVariables } from 'hooks/harbor/useSnowflakeConnection';
import ModalInputBox from 'components/modal/ModalInputBox';
import ModalButtons from 'components/modal/ModalButtons';
import {ModalWrapper} from 'components/modal/ModalWrapper';
import Spinner from 'components/spinner/Spinner';

const SnowflakeConnectionCustomModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const [inputs, setInputs] = useState<SnowflakeVariables>({
        account:"",
        username:"",
        password:"",
        application:"",
        role:"",
        warehouse:"",
        database:"",
        schema:"",
        tableName:"",
    })
    const [showAlert, setShowAlert] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const {
        saveSnowflakeFile,
        uploadStatus,
        errorMessage,
        uploadProgress,
        setUploadStatus,
        setErrorMessage,
        setUploadProgress,
        isUploading,
    } = useSnowflakeConnection();

    const handleConnect = async () => {
        // TODO: Implement Snowflake variables validation checks
        const resp = await saveSnowflakeFile(inputs);
        if (resp) {
            onClose();
        }
        setShowAlert(true);
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title={'Connect to Snowflake'}
        >

            {isUploading && (
                <Spinner className='h-6 w-6 border-2' />
            )}

            <ModalInputBox
                title="Account"
                value={inputs.account}
                onChange={(e) => setInputs({ ...inputs, account: e.target.value })}
                placeholder=""
                disabled={isUploading}
                className='mb-3'
            />
            <ModalInputBox
                title="Username"
                value={inputs.username}
                onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                placeholder=""
                disabled={isUploading}
                className='mb-3'
            />
            <ModalInputBox
                title="Password"
                value={inputs.password}
                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                type="password"
                disabled={isUploading}
                className='mb-3'
            />
            <ModalInputBox
                title="Application"
                value={inputs.application}
                onChange={(e) => setInputs({ ...inputs, application: e.target.value })}
                placeholder=""
                disabled={isUploading}
                className='mb-3'
            />
            <ModalInputBox
                title="Role"
                value={inputs.role}
                onChange={(e) => setInputs({ ...inputs, role: e.target.value })}
                placeholder=""
                disabled={isUploading}
                className='mb-3'
            />
            <ModalInputBox
                title="Warehouse"
                value={inputs.warehouse}
                onChange={(e) => setInputs({ ...inputs, warehouse: e.target.value })}
                placeholder=""
                disabled={isUploading}
                className='mb-3'
            />
            <ModalInputBox
                title="Database"
                value={inputs.database}
                onChange={(e) => setInputs({ ...inputs, database: e.target.value })}
                placeholder=""
                disabled={isUploading}
                className='mb-3'
            />
            <ModalInputBox
                title="Schema"
                value={inputs.schema}
                onChange={(e) => setInputs({ ...inputs, schema: e.target.value })}
                placeholder=""
                disabled={isUploading}
                className='mb-3'
            />
            <ModalInputBox
                title="Table Name"
                value={inputs.tableName}
                onChange={(e) => setInputs({ ...inputs, tableName: e.target.value })}
                placeholder=""
                disabled={isUploading}
                className='mb-3'
            />
            <ModalButtons
                onClose={onClose}
                handleConnect={handleConnect}
                divClassName='mt-4'
            />
        </ModalWrapper>
    );
};

export default SnowflakeConnectionCustomModal;

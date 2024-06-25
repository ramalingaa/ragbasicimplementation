import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import usePostgresqlConnection, { PostgresConnectionFormInputs } from 'hooks/harbor/usePostgresqlConnection';
import {ModalWrapper} from 'components/modal/ModalWrapper';
import ModalButtons from 'components/modal/ModalButtons';

const PostgresConnectionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {

    const [postgresConnectionFormInputs, setPostgresConnectionFormInputs] = useState<PostgresConnectionFormInputs>({
        hostName: '',
        port: 5432,
        databaseName: '',
        userName: '',
        password: '',
        tableName: '',
    });

    const {
        uploadStatus,
        errorMessage,
        uploadProgress,
        setUploadStatus,
        setErrorMessage,
        setUploadProgress,
        isUploading,
        savePostgresqlConnectionDetails,
    } = usePostgresqlConnection();

    const handleConnect = async () => {
        await savePostgresqlConnectionDetails(postgresConnectionFormInputs);
        onClose();
    }

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Connect to Postgres" className="sm:w-full sm:max-w-sm">

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="hostName" className="block text-sm font-medium leading-6 text-gray-900">
                            Host Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="hostName"
                                name="hostName"
                                type="text"
                                autoComplete="hostName"
                                required
                                value={postgresConnectionFormInputs.hostName}
                                onChange={e => setPostgresConnectionFormInputs({ ...postgresConnectionFormInputs, hostName: e.target.value })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="port" className="block text-sm font-medium leading-6 text-gray-900">
                                Port
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="port"
                                name="port"
                                type="number"
                                autoComplete="port"
                                required
                                value={postgresConnectionFormInputs.port}
                                onChange={e => setPostgresConnectionFormInputs({ ...postgresConnectionFormInputs, port: parseInt(e.target.value) })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="databaseName" className="block text-sm font-medium leading-6 text-gray-900">
                            Database Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="databaseName"
                                name="databaseName"
                                type="text"
                                autoComplete="email"
                                required
                                value={postgresConnectionFormInputs.databaseName}
                                onChange={e => setPostgresConnectionFormInputs({ ...postgresConnectionFormInputs, databaseName: e.target.value })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium leading-6 text-gray-900">
                            User Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="userName"
                                name="userName"
                                type="text"
                                autoComplete="userName"
                                required
                                value={postgresConnectionFormInputs.userName}
                                onChange={e => setPostgresConnectionFormInputs({ ...postgresConnectionFormInputs, userName: e.target.value })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="password"
                                required
                                value={postgresConnectionFormInputs.password}
                                onChange={e => setPostgresConnectionFormInputs({ ...postgresConnectionFormInputs, password: e.target.value })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="tableName" className="block text-sm font-medium leading-6 text-gray-900">
                            Table Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="tableName"
                                name="tableName"
                                type="text"
                                autoComplete="tableName"
                                required
                                value={postgresConnectionFormInputs.tableName}
                                onChange={e => setPostgresConnectionFormInputs({ ...postgresConnectionFormInputs, tableName: e.target.value })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <ModalButtons handleConnect={handleConnect} onClose={onClose} loading={isUploading} />
                </div>

            </div>
        </ModalWrapper>
    )
}
export default PostgresConnectionModal;
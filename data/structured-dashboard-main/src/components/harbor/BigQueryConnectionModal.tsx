import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import useBigQueryConnection, { BigQueryConnectionFormInputs } from 'hooks/harbor/useBigQueryConnection';
import {ModalWrapper} from 'components/modal/ModalWrapper';
import ModalButtons from 'components/modal/ModalButtons';

const BigQueryConnectionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {

    const [bigQueryConnectionFormInputs, setBigQueryConnectionFormInputs] = useState<BigQueryConnectionFormInputs>({
        type: 'service_account',
        project_id: '',
        private_key_id: '',
        private_key: '',
        client_email: '',
        client_id: '',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: '',
        universe_domain: 'googleapis.com',
        tableName: ''
    });


    const {
        uploadStatus,
        errorMessage,
        uploadProgress,
        setUploadStatus,
        setErrorMessage,
        setUploadProgress,
        isUploading,
        saveBigQueryConnectionDetails,
    } = useBigQueryConnection();

    const handleConnect = async () => {
        console.log({ bigQueryConnectionFormInputs })
        // TODO: validate inputs
        const res = await saveBigQueryConnectionDetails(bigQueryConnectionFormInputs);
        console.log({ res })
        if (res) {
            onClose();
        }
    }

    return (
        // Big Query Integration Inputs
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Connect to BigQuery" className="sm:w-full sm:max-w-sm">
            {/* Spinner */}
            {isUploading && (
                <div className="flex items-center justify-center mt-4">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V4a10 10 0 00-10 10h2zm2 8a8 8 0 018-8h2a10 10 0 00-10 10v-2z"></path>
                    </svg>
                    <p className="text-indigo-600">Uploading...</p>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="mt-4">
                    <p className="text-red-600">{errorMessage}</p>
                </div>
            )}

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
                            Account Type
                        </label>
                        <div className="mt-2">
                            <input
                                id="type"
                                name="type"
                                type="text"
                                autoComplete="type"
                                required
                                disabled={isUploading}
                                value={bigQueryConnectionFormInputs.type}
                                onChange={e => setBigQueryConnectionFormInputs({ ...bigQueryConnectionFormInputs, type: e.target.value })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="project_id" className="block text-sm font-medium leading-6 text-gray-900">
                                Project ID
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="project_id"
                                name="project_id"
                                type="text"
                                autoComplete="project_id"
                                required
                                disabled={isUploading}
                                value={bigQueryConnectionFormInputs.project_id}
                                onChange={e => setBigQueryConnectionFormInputs({ ...bigQueryConnectionFormInputs, project_id: e.target.value })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="private_key_id" className="block text-sm font-medium leading-6 text-gray-900">
                            Private Key ID
                        </label>
                        <div className="mt-2">
                            <input
                                id="private_key_id"
                                name="private_key_id"
                                type="text"
                                autoComplete="email"
                                required
                                disabled={isUploading}
                                value={bigQueryConnectionFormInputs.private_key_id}
                                onChange={e => setBigQueryConnectionFormInputs({ ...bigQueryConnectionFormInputs, private_key_id: e.target.value })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="private_key" className="block text-sm font-medium leading-6 text-gray-900">
                            Private Key
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="private_key"
                                name="private_key"
                                rows={3}
                                autoComplete="private_key"
                                required
                                disabled={isUploading}
                                value={bigQueryConnectionFormInputs.private_key}
                                onChange={e => setBigQueryConnectionFormInputs({ ...bigQueryConnectionFormInputs, private_key: e.target.value?.replace(/\\n/g, "\n") })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="client_email" className="block text-sm font-medium leading-6 text-gray-900">
                            Client Email
                        </label>
                        <div className="mt-2">
                            <input
                                id="client_email"
                                name="client_email"
                                type="email"
                                autoComplete="client_email"
                                required
                                disabled={isUploading}
                                value={bigQueryConnectionFormInputs.client_email}
                                onChange={e => setBigQueryConnectionFormInputs({ ...bigQueryConnectionFormInputs, client_email: e.target.value })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="client_id" className="block text-sm font-medium leading-6 text-gray-900">
                            Client ID
                        </label>
                        <div className="mt-2">
                            <input
                                id="client_id"
                                name="client_id"
                                type="text"
                                autoComplete="client_id"
                                required
                                disabled={isUploading}
                                value={bigQueryConnectionFormInputs.client_id}
                                onChange={e => setBigQueryConnectionFormInputs({ ...bigQueryConnectionFormInputs, client_id: e.target.value })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="auth_uri" className="block text-sm font-medium leading-6 text-gray-900">
                            Auth URI
                        </label>
                        <div className="mt-2">
                            <input
                                id="auth_uri"
                                name="auth_uri"
                                type="text"
                                autoComplete="auth_uri"
                                required
                                disabled={isUploading}
                                value={bigQueryConnectionFormInputs.auth_uri}
                                onChange={e => setBigQueryConnectionFormInputs({ ...bigQueryConnectionFormInputs, auth_uri: e.target.value })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="token_uri" className="block text-sm font-medium leading-6 text-gray-900">
                            Token URI
                        </label>
                        <div className="mt-2">
                            <input
                                id="token_uri"
                                name="token_uri"
                                type="text"
                                autoComplete="token_uri"
                                required
                                disabled={isUploading}
                                value={bigQueryConnectionFormInputs.token_uri}
                                onChange={e => setBigQueryConnectionFormInputs({ ...bigQueryConnectionFormInputs, token_uri: e.target.value })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="auth_provider_x509_cert_url" className="block text-sm font-medium leading-6 text-gray-900">
                            Auth Provider x509 Cert URL
                        </label>
                        <div className="mt-2">
                            <input
                                id="auth_provider_x509_cert_url"
                                name="auth_provider_x509_cert_url"
                                type="text"
                                autoComplete="auth_provider_x509_cert_url"
                                required
                                disabled={isUploading}
                                value={bigQueryConnectionFormInputs.auth_provider_x509_cert_url}
                                onChange={e => setBigQueryConnectionFormInputs({ ...bigQueryConnectionFormInputs, auth_provider_x509_cert_url: e.target.value })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="client_x509_cert_url" className="block text-sm font-medium leading-6 text-gray-900">
                            Client x509 Cert URL
                        </label>
                        <div className="mt-2">
                            <input
                                id="client_x509_cert_url"
                                name="client_x509_cert_url"
                                type="text"
                                autoComplete="client_x509_cert_url"
                                required
                                disabled={isUploading}
                                value={bigQueryConnectionFormInputs.client_x509_cert_url}
                                onChange={e => setBigQueryConnectionFormInputs({ ...bigQueryConnectionFormInputs, client_x509_cert_url: e.target.value })}
                                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="universe_domain" className="block text-sm font-medium leading-6 text-gray-900">
                            Universe Domain
                        </label>
                        <div className="mt-2">
                            <input
                                id="universe_domain"
                                name="universe_domain"
                                type="text"
                                autoComplete="universe_domain"
                                required
                                disabled={isUploading}
                                value={bigQueryConnectionFormInputs.universe_domain}
                                onChange={e => setBigQueryConnectionFormInputs({ ...bigQueryConnectionFormInputs, universe_domain: e.target.value })}
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
                                disabled={isUploading}
                                value={bigQueryConnectionFormInputs.tableName}
                                onChange={e => setBigQueryConnectionFormInputs({ ...bigQueryConnectionFormInputs, tableName: e.target.value })}
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
export default BigQueryConnectionModal;
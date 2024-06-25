import { ModalWrapper } from "components/modal/ModalWrapper";
import { useEffect, useState } from "react";
import { useHarborStore } from "zustand/harbor/harborStore"
import { useWorkspaceStore } from "zustand/workspaces/workspaceStore";
import { FaCopy } from "react-icons/fa";
import { IoCheckmarkOutline } from "react-icons/io5";

const ConnectionDetail = ({ detailName, detailValue }: {
    detailName: string;
    detailValue: string;
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(detailValue).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 5000); // Revert icon back after 5 seconds
        });
    };
    return (
        <div className="relative mb-4">
            <label className="text-sm font-medium text-gray-900 mb-2 block capitalize">
                {detailName.replace(/([A-Z])/g, ' $1').trim()}:
            </label>
            <div className="flex flex-row items-center">
                <input
                    type="text"
                    className="truncate text-ellipsis pr-10 col-span-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={detailValue}
                    disabled
                    readOnly
                />
                <button
                    onClick={handleCopy}
                    className="absolute end-2 -translate-y text-gray-800 hover:bg-gray-900 hover:text-white rounded-lg p-2 inline-flex items-center justify-center ease-in-out transition duration-300"
                >
                    {copied ? (
                        <IoCheckmarkOutline className="w-5 h-5 text-green-500" />
                    ) : (
                        <FaCopy className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
};

const UnitsDbConnModal = () => {
    const {
        isGeneratePsqlUnitsOpen,
        onCloseGeneratePsqlUnitsModal
    } = useHarborStore();

    const { currentWorkspace } = useWorkspaceStore();

    const [dbConnDetails, setDbConnDetails] = useState({
        host: "",
        port: "",
        instanceIdentifier: "",
        masterUserName: "",
        masterPassword: "",
    });

    useEffect(() => {
        if (currentWorkspace?.dbDetails) {
            setDbConnDetails(currentWorkspace.dbDetails);
        }
    }, [currentWorkspace?.dbDetails]);

    return (
        <ModalWrapper
            isOpen={isGeneratePsqlUnitsOpen}
            onClose={onCloseGeneratePsqlUnitsModal}
            title={'DATABASE CONNECTION DETAILS'}
        >
            {Object.entries(dbConnDetails).map(([key, value]) => (
                <ConnectionDetail key={key} detailName={key} detailValue={value} />
            ))}
        </ModalWrapper>
    )
}

export default UnitsDbConnModal;

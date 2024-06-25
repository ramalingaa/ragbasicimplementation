import ModalButtons from "components/modal/ModalButtons";
import { ModalWrapper } from "components/modal/ModalWrapper"
import useSendInvitations from "hooks/workspace/useSendInvitations";
import { useState } from "react";
import { useNotificationStore } from "../../../zustand/notification/notificationStore";

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [invitesStr, setInvitesStr] = useState("");
    const { sendInvitations, isLoadingSendInvitations } = useSendInvitations();
    const isValidEmail = (email: string): boolean => {
        // 1. Check for presence of an @ sign
        if (!email.includes('@')) {
            return false;
        }

        // 2. Split the email into local part and domain part
        const parts = email.split('@');
        if (parts.length !== 2) {
            return false;
        }
        const [local, domain] = parts;

        // 3. Check that the local part is not empty
        if (!local.length) {
            return false;
        }

        // 4. Check that the domain part is not empty
        if (!domain.length) {
            return false;
        }

        // 5. Check for presence of a dot in the domain part (for domain and TLD)
        if (domain.lastIndexOf('.') <= 0) {
            return false;
        }

        // 6. Check that the domain part has at least one dot and it's not the last character
        if (domain.indexOf('.') === domain.length - 1) {
            return false;
        }

        // 7. Check for forbidden characters in the local part (RFC 5322 Official Standard)
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) {
            return false;
        }

        // 8. Check for IP address in domain part (not allowed in a typical email validation)
        if (/^\[[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\]$/.test(domain)) {
            return false;
        }

        // 9. Check for double dots in local or domain part
        if (local.includes('..') || domain.includes('..')) {
            return false;
        }

        // 10. Check length of the TLD
        const domainParts = domain.split('.');
        const tld = domainParts.pop() || '';
        if (tld.length < 2) {
            return false;
        }

        return true;
    }
    const {
        setNotificationState,
    } = useNotificationStore();

    const sendInvites = async () => {
        const invites = invitesStr.split(',').map((email) => email.trim());
        const validInvites = invites.filter(email => isValidEmail(email));

        if (validInvites.length !== invites.length) {
            setNotificationState(true, 'Some email addresses are invalid', 'failure');
            return;
        }

        console.log({ validInvites });
        await sendInvitations(validInvites);
        setInvitesStr("");
        onClose();
    }

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title="Invite members"
        >
            <div className="px-2 pb-2 w-full">
                <div className="w-full">
                    <div className="sm:col-span-4 w-full">
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900" aria-required>
                            Email addresses
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 w-full">
                                <input
                                    type="text"
                                    name="email"
                                    id="workspaceName"
                                    value={invitesStr}
                                    disabled={isLoadingSendInvitations}
                                    onChange={(e) => setInvitesStr(e.target.value)}
                                    autoComplete="off"
                                    className={`block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 ${isLoadingSendInvitations ? 'bg-neutral-100 text-neutral-500' : 'focus:ring-blue-500'}`}
                                    placeholder="john@example.com, alice@example.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalButtons
                connectBtnText="Invite"
                handleConnect={sendInvites}
                onClose={onClose}
                loading={isLoadingSendInvitations}
            />
        </ModalWrapper>
    )
}

export default InviteMemberModal
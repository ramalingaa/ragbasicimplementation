import InvitationTemplate from 'components/emailTemplates/invitationTemplate';
import { Resend } from 'resend';
import { INVITATION_EMAIL_FROM } from './constants';
const resend = new Resend(process.env.RESEND_SECRET_KEY);

export async function sendInvitationEmails(
    to: string[],
    workspaceName: string
) {
    try {
        const { data, error } = await resend.emails.send({
            from: INVITATION_EMAIL_FROM,
            to: to,
            subject: `Invitation to Join ${workspaceName} on Structured`,
            react: InvitationTemplate({
                workspaceName,
            })
        });
        if (error) {
            console.error("Error sending invitation emails", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error sending invitation emails", error);
        return false;
    }
}
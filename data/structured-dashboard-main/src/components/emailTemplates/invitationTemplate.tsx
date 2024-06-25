import React from 'react';

interface InvitationTemplateProps {
  workspaceName: string;
}

const InvitationTemplate: React.FC<Readonly<InvitationTemplateProps>> = ({ workspaceName }) => {
  return (
    <div className="max-w-xl mx-auto text-center py-8 px-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-semibold mb-4">Hello!</h1>
      <p className="mb-4">
        You've been invited to join the <span className="font-bold">{workspaceName}</span> Workspace on Structured. We're excited to have you onboard.
      </p>
      <p className="mb-4">
        To get started, simply click the link below to create your Structured account. If you already have an account, you'll be prompted to log in and will automatically join the workspace.
      </p>
      <a
        href={"https://app.structuredlabs.io/auth/sign-in"}
        className="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        Accept Invitation
      </a>
      <p className="mt-4 mb-2">
        If you have any questions or need help getting started, feel free to reach out.
      </p>
      <p className="mb-4">
        If you did not expect to receive this, please ignore this email.
      </p>
      <p className="text-sm text-gray-600 mt-4">
        Best,
        <br />
        The Structured Team
      </p>
    </div>
  );
};

export default InvitationTemplate;

import { deleteInvitation } from "utils/aws_helpers";

export async function POST(req: any) {
    try {
        const {
            WorkspaceId,
            userId,
            invitationId } = await req.json();

        if (!userId || !WorkspaceId || !invitationId) {
            throw new Error("Missing required fields");
        }
        await deleteInvitation(invitationId);
        return new Response(JSON.stringify({ success: true }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error || "Error occurred " }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}
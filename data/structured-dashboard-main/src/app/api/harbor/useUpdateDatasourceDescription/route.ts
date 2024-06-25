import { updateDatasourceDescription } from "utils/aws_helpers";

export async function POST(req: any) {
    try {
        const {
            WorkspaceId,
            datasourceId,
            description
        } = await req.json();

        const success = await updateDatasourceDescription(
            WorkspaceId,
            datasourceId,
            description
        );
        return new Response(
            JSON.stringify({
                success: success,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error || 'An unknown error occurred' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }
}
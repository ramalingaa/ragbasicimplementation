import { saveDescriptionForColumnInSchemaHelper } from "utils/aws_helpers";

export async function POST(req: any) {
    try {
        const {
            WorkspaceId,
            datasourceId,
            columnName,
            description
        } = await req.json();

        const success = await saveDescriptionForColumnInSchemaHelper(
            WorkspaceId,
            datasourceId,
            columnName,
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
        console.log(error);
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
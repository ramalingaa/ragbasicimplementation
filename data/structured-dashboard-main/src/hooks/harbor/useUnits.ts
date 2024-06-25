import axios from "axios";
import { useState } from "react";
import { useHarborStore } from "zustand/harbor/harborStore";
import { useWorkspaceStore } from "zustand/workspaces/workspaceStore";

export default function useUnits() {
    const {
        onOpenGeneratePsqlUnitsModal
    } = useHarborStore();
    const [isLoading, setIsLoading] = useState(false);
    const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();

    const generatePsqlUnits = async () => {
        if (!currentWorkspace) return;
        console.log("currentWorkspace: ", currentWorkspace);
        try {
            if (currentWorkspace.dbDetails != null) {
                onOpenGeneratePsqlUnitsModal();
                return;
            }
            setIsLoading(true);
            const response = await axios.post("/api/harbor/generatePsqlUnits", {
                workspaceId: currentWorkspace.WorkspaceID
            })
            console.log("[generatePsqlUnits]:", response.data);
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            if (response.data.message === 'success') {
                setCurrentWorkspace({
                    ...currentWorkspace,
                    dbDetails: response.data,
                })
            }
            setIsLoading(false);
        } catch (error: unknown) {
            console.error("Error generating units", error);
            setIsLoading(false);
        } finally {
            onOpenGeneratePsqlUnitsModal();
        }
    }

    return {
        generatePsqlUnits,
        isLoading,
    }
}

import React, { useEffect, useState } from "react";
import useFetchDataSources from "hooks/harbor/useFetchDataSources";
import { ENTITY_TYPE_FILES_DIR } from "utils/constants";
import { useHarborStore } from "zustand/harbor/harborStore";
import { useWorkspaceStore } from "zustand/workspaces/workspaceStore";
import UnitsDbConnModal from "./UnitsDbConnModal";
import useEntityTypes from "hooks/harbor/useEntityTypes";
import { v4 } from "uuid";
import { useUnitsStore } from "zustand/harbor/unitsStore";
import EmptyState from "components/emptyState/EmptyState";
import Spinner from "components/spinner/Spinner";

export default function UnitPage() {
    const { setEntityTypes } = useHarborStore();
    const { units,
        setUnits,
        setFilterText,
        filteredUnits,
        setFilteredUnits, } = useUnitsStore();
    const { currentWorkspace } = useWorkspaceStore();
    const { getFileContents } = useFetchDataSources();
    const { fetchEntityTypes } = useEntityTypes();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            console.log("INITIALIZING UNIT PAGE")
            setLoading(true);
            let entityTypesLocal = [];
            const resp = await fetchEntityTypes();
            entityTypesLocal = [...resp];
            let unitsLocal: any = [];
            console.log("entityTypesLocal.length", entityTypesLocal.length)
            if (entityTypesLocal.length) {
                console.log("FETCHING ALL TYPES CONTENTS")
                for (let i = 0; i < entityTypesLocal.length; i++) {
                    if (entityTypesLocal[i].decodedContents) continue;
                    let resp = await getFileContents(entityTypesLocal[i], ENTITY_TYPE_FILES_DIR);
                    console.log("resp: ", resp)
                    entityTypesLocal[i].decodedContents = resp;
                    unitsLocal = [...unitsLocal, ...entityTypesLocal[i].decodedContents];
                }
                setEntityTypes(entityTypesLocal);
                setUnits([...unitsLocal]);
                setFilteredUnits([...unitsLocal]);
                setLoading(false);
            }
        }
        if (currentWorkspace?.WorkspaceID) {
            init()
        }
        setFilterText('');
    }, [currentWorkspace?.WorkspaceID]);

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8 h-full">
                <div className="flow-root h-full">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 h-full">
                        <div className="inline-block min-w-full py-2 align-middle h-full">
                            <table className="min-w-full divide-y divide-gray-300 h-full">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                                        >
                                            Types Single Record
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white h-full">
                                    {filteredUnits.length ? filteredUnits.map((ds: any) => (
                                        <tr key={v4()}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                                {JSON.stringify(ds)}
                                            </td>
                                        </tr>
                                    )) : loading ? 
                                    
                                    <div className="h-full">
                                        <Spinner className='h-6 w-6 border-2' /> 
                                    </div>
                                    :
                                        <div className="h-full">
                                            <EmptyState
                                                title="No Data"
                                                desciption="No data found"
                                            />
                                        </div>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <UnitsDbConnModal />
        </>
    );
}

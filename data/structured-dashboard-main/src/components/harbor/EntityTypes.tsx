import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useWorkspaceStore } from 'zustand/workspaces/workspaceStore';
import EmptyState from 'components/emptyState/EmptyState';
import { formatEntityTypePropertiesObj } from 'utils/aws_helpers';
import { ReactFlowProvider } from 'reactflow';

function EntityTypesTable() {
    const { entityTypes } = useHarborStore();

    return (
        <div className='flex flex-col h-full overflow-y-auto overflow-x-auto w-full border-r-[1px] border-[#eeeff1] entity-types-grid'>
            {entityTypes.length === 0 ? (
                <EmptyState
                    title='No Entity Types'
                    desciption='There are no entity types in this workspace. '
                />
            ) : (
                <EntityTypesTableComponent
                    dataSources={entityTypes}
                />
            )}
        </div>
    );
}

import React, { useEffect, useRef, useState } from "react";
import SampleSplitter from "./SampleSplitter";
//@ts-ignore
import { useResizable } from "react-resizable-layout";
import "./source.css";
import { useHarborStore } from "zustand/harbor/harborStore";
import EntityTypesGraphView from './EntityTypesGraphView';
import useEntityTypes from 'hooks/harbor/useEntityTypes';
import EntityTypesTableComponent from './EntityTypesTableComponent';
import Visualizer from 'components/harborGraph/Visualizer';
// Utility function to combine class names
export const cn = (...args: any[]) => args.filter(Boolean).join(" ");

const EntityTypes = (): JSX.Element => {

    const { typesTableAndGraphViewSideBySide, entityTypes, setEntityTypes } = useHarborStore();
    const fileSystesmTableRef = useRef<HTMLDivElement>(null);
    const { currentWorkspace } = useWorkspaceStore();

    const {
        isDragging: isTerminalDragging,
        position: terminalH,
        setPosition: setTerminalH,
        splitterProps: terminalDragBarProps
    } = useResizable({
        axis: "y",
        initial: 200,
        min: 50,
        reverse: true
    });
    const {
        isDragging: isFileDragging,
        position: fileW,
        setPosition: setFileW,
        splitterProps: fileDragBarProps
    } = useResizable({
        axis: typesTableAndGraphViewSideBySide ? "x" : "y",
        initial: typesTableAndGraphViewSideBySide ? 850 : 450,
        min: 50,
        containerRef: fileSystesmTableRef,
    });

    const {
        isDragging: isGraphViewDragging,
        position: graphViewW,
        setPosition: setGraphViewW,
        splitterProps: graphViewDragBarProps
    } = useResizable({
        axis: "x",
        initial: 200,
        min: 50,
        reverse: true,
    });

    useEffect(() => {
        if (typesTableAndGraphViewSideBySide) {
            setFileW(850)
        } else {
            setFileW(450)
        }

    }, [typesTableAndGraphViewSideBySide])

    const { fetchEntityTypes, isLoading } = useEntityTypes();

    useEffect(() => {
        async function init() {
            await fetchEntityTypes();
        }
        init();
    }, [currentWorkspace?.WorkspaceID])


    if (isLoading) {
        return (
            <div className="py-4 flex justify-center items-center h-full">
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-gray-600"
                    role="status">
                    <span
                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div
            className={
                "flex flex-col h-auto text-white overflow-hidden w-full min-h-full"
            }
        >
            <div className={"flex grow w-full"}>
                <div
                    ref={fileSystesmTableRef}
                    className={cn("shrink-0 contents1", isFileDragging && "dragging1")}
                    style={{
                        width: typesTableAndGraphViewSideBySide ? fileW : '100%',
                        height: typesTableAndGraphViewSideBySide ? '100%' : fileW
                    }}
                >
                    <EntityTypesTable />
                </div>
                {
                    typesTableAndGraphViewSideBySide && (
                        <>
                            <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
                            <div
                                className={cn("shrink-0 contents1 flex-grow", isGraphViewDragging && "dragging1")}
                                style={{ width: graphViewW }}
                            >
                                {/* <ReactFlowProvider>
                                    <EntityTypesGraphView />
                                </ReactFlowProvider> */}
                                <Visualizer database={"entity"} />
                            </div>
                        </>
                    )
                }
            </div>

            {!typesTableAndGraphViewSideBySide && (
                <>
                    <SampleSplitter
                        dir={"horizontal"}
                        isDragging={isFileDragging}
                        {...fileDragBarProps}
                    />
                    <div className={"flex grow w-full h-full"}>
                        <div
                            className={cn(
                                "flex flex-col shrink-0 contents1 w-full h-full",
                                isTerminalDragging && "dragging1"
                            )}
                            style={{ height: `calc(100vh - 6rem - 10px - ${fileW}px)` }}
                        >
                            {/* <ReactFlowProvider>
                                <EntityTypesGraphView />
                            </ReactFlowProvider> */}
                            <Visualizer database={"entity"} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default EntityTypes;

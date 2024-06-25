
import React, { useEffect, useRef, useState } from "react";
import SampleSplitter from "./SampleSplitter";
import HarborGraphView from "components/harbor/HarborGraphView";
import ConnectedDataSources from "components/harbor/ConnectedDataSources";
//@ts-ignore
import { useResizable } from "react-resizable-layout";
import "./source.css"
import { useHarborStore } from "zustand/harbor/harborStore";
import useFetchDataSources from "hooks/harbor/useFetchDataSources";
import Visualizer from "components/harborGraph/Visualizer";
// Utility function to combine class names
export const cn = (...args: any[]) => args.filter(Boolean).join(" ");

const SourcePage = (): JSX.Element => {

  const { sourcesTableAndGraphViewSideBySide } = useHarborStore();
  const fileSystesmTableRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useFetchDataSources();

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
    axis: sourcesTableAndGraphViewSideBySide ? "x" : "y",
    initial: sourcesTableAndGraphViewSideBySide ? 850 : 450,
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
    if (sourcesTableAndGraphViewSideBySide) {
      setFileW(850)
    } else {
      setFileW(450)
    }

  }, [sourcesTableAndGraphViewSideBySide])

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
        "flex flex-col h-auto text-white overflow-hidden w-full min-h-full relative"
      }
    >
      <div className={"flex grow w-full"}>
        <div
          ref={fileSystesmTableRef}
          className={cn("shrink-0 contents1", isFileDragging && "dragging1")}
          style={{
            width: sourcesTableAndGraphViewSideBySide ? fileW : '100%',
            height: sourcesTableAndGraphViewSideBySide ? '100%' : fileW
          }}
        >
          <ConnectedDataSources />
        </div>
        {
          sourcesTableAndGraphViewSideBySide && (
            <>
              <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
              <div
                className={cn("shrink-0 contents1 flex-grow", isGraphViewDragging && "dragging1")}
                style={{ width: graphViewW }}
              >
                <Visualizer database={"source"} />
                {/* <HarborGraphView /> */}
              </div>
            </>
          )
        }
      </div>

      {!sourcesTableAndGraphViewSideBySide && (
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
              {/* <HarborGraphView /> */}
              <Visualizer database={"source"} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SourcePage;

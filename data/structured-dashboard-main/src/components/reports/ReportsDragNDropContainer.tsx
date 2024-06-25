import React, { useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  CompleteReport,
  ReportBox,
  useReportsStore,
} from '../../zustand/reports/reportsStore';
import { QueryItemBox } from './QueryItemBox';
import TextBoxItemBox from './TextBoxItemBox';

interface ReportsDragNDropContainerProps {
  savedReportBoxes: ReportBox[];
  onViewMode?: boolean;
  completeReport: CompleteReport;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const ReportsDragNDropContainer: React.FC<ReportsDragNDropContainerProps> = ({
  savedReportBoxes,
  onViewMode,
  completeReport,
}) => {
  const reportBoxes = useReportsStore((state) => state.reportBoxes);
  const setReportBoxes = useReportsStore((state) => state.setReportBoxes);

  useEffect(() => {
    console.log('savedReportBoxes', savedReportBoxes);
    if (savedReportBoxes) {
      setReportBoxes(savedReportBoxes);
    }
  }, []);

  const generateDOM = () => {
    return reportBoxes.map((box) => {
      if (box.boxType === 'queryItem') {
        return (
          <div
            key={box.layout.i}
            className="border border-gray-300 rounded-md cursor-pointer p-4"
          >
            <div className="cursor-default">
              <QueryItemBox
                item={box.boxItem}
                onViewMode={onViewMode}
                completeReport={completeReport}
              />
            </div>
          </div>
        );
      } else if (box.boxType === 'textBoxItem') {
        return (
          <div
            key={box.layout.i}
            className="border border-gray-300 rounded-md cursor-pointer p-4"
          >
            <div className="cursor-text">
              <TextBoxItemBox
                textBoxItem={box.boxItem}
                onViewMode={onViewMode}
              />
            </div>
          </div>
        );
      }
      return null;
    });
  };

  const onLayoutChange = (layout: any, layouts: any) => {
    console.log('Layout:', layout);
    console.log('Layouts:', layouts);

    const updatedReportBoxes: ReportBox[] = reportBoxes.map((box) => {
      const updatedLayout = layout.find((l: any) => l.i === box.layout.i);
      return {
        ...box,
        layout: updatedLayout || box.layout,
      };
    });

    console.log('__________________________');
    console.log('updatedReportBoxes', updatedReportBoxes);
    console.log('__________________________');

    setReportBoxes(updatedReportBoxes);
  };

  return (
    <div className="mb-8">
      <ResponsiveGridLayout
        className="layout border-2 border-gray-200 rounded-md p-4 mb-4"
        layouts={{ lg: reportBoxes.map((box) => box.layout) }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={50}
        onLayoutChange={onLayoutChange}
        style={{ minHeight: '600px' }}
        isDraggable={!onViewMode}
        isResizable={!onViewMode}
        onResizeStart={onViewMode ? () => false : undefined}
        onDragStart={onViewMode ? () => false : undefined}
        autoSize
      >
        {generateDOM()}
      </ResponsiveGridLayout>
    </div>
  );
};

export default ReportsDragNDropContainer;

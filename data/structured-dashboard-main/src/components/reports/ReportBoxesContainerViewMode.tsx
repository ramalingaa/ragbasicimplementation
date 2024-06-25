import React, { useEffect } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ReportBox, useReportsStore } from '../../zustand/reports/reportsStore';
import { EmbeddedQueryItem } from './EmbeddedQueryItem';
import TextBoxItemBoxViewMode from './TextBoxItemBoxViewMode';

interface ReportBoxesContainerViewModeProps {
  savedReportBoxes: ReportBox[];
}

const ReportBoxesContainerViewMode: React.FC<
  ReportBoxesContainerViewModeProps
> = ({ savedReportBoxes }) => {
  const reportBoxes = useReportsStore((state) => state.reportBoxes);
  const setReportBoxes = useReportsStore((state) => state.setReportBoxes);

  useEffect(() => {
    console.log('savedReportBoxes', savedReportBoxes);
    if (savedReportBoxes) {
      setReportBoxes(savedReportBoxes);
    }
  }, []);

  const generateDOM = () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        {reportBoxes.map((box, index) => {
          if (box.boxType === 'queryItem') {
            return (
              <div
                key={box.layout.i}
                className="border border-gray-300 rounded-md p-2"
              >
                <EmbeddedQueryItem
                  item={box.boxItem}
                  index={index}
                  isDrillDownLoading=""
                  handleDrillDown={() => {}}
                />
              </div>
            );
          } else if (box.boxType === 'textBoxItem') {
            return (
              <div
                key={box.layout.i}
                className="border border-gray-300 rounded-md p-2"
              >
                <TextBoxItemBoxViewMode textBoxItem={box.boxItem} />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="mb-8">
      <div
        className="layout border-2 border-gray-200 rounded-md p-4 mb-4"
        style={{ minHeight: '600px' }}
      >
        {generateDOM()}
      </div>
    </div>
  );
};

export default ReportBoxesContainerViewMode;

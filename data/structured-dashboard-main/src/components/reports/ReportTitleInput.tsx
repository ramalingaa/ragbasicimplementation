import React from 'react';
import classNames from 'classnames';

interface ReportTitleInputProps {
  reportTitle: string;
  setReportTitle: React.Dispatch<React.SetStateAction<string>>;
  reportCreationNoTitleEntered: boolean;
}

export const ReportTitleInput: React.FC<ReportTitleInputProps> = ({
  reportTitle,
  setReportTitle,
  reportCreationNoTitleEntered,
}) => {
  return (
    <div className="relative mt-6">
      <input
        type="text"
        value={reportTitle}
        onChange={(e) => setReportTitle(e.target.value)}
        className={classNames(
          'relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6',
          reportCreationNoTitleEntered
            ? 'ring-red-500 ring-2'
            : 'ring-gray-300',
        )}
        placeholder="Enter report title"
      />
    </div>
  );
};

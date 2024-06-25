import React from 'react';

interface KpiCardInfoProps {
  title: string;
  resultEntity: string;
  result: string;
  resultConnotation: string;
}

const KpiCardInfo: React.FC<KpiCardInfoProps> = ({
  title,
  resultEntity,
  result,
  resultConnotation,
}) => {
  let bgColor = '';
  let textColor = '';

  if (resultConnotation === 'positive') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  } else if (resultConnotation === 'negative') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  } else {
    bgColor = 'bg-gray-100';
    textColor = 'text-gray-800';
  }

  return (
    <div className="mt-4 rounded-md shadow-md p-4">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <div className="flex items-baseline">
        <p
          className={`text-lg font-bold mr-2 px-2 py-1 rounded-md ${bgColor} ${textColor}`}
        >
          {result}
        </p>
        <span className="text-xs">{resultEntity}</span>
      </div>
    </div>
  );
};

export default KpiCardInfo;

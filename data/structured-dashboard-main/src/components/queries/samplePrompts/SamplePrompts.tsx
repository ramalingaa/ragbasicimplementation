import useThemeColors from 'hooks/useThemeColors';
import { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useDashboardStore } from '../../../zustand/reports/store';

``;

interface SamplePromptsProps {
  handleGetResultsFromSamplePrompt: (query: string) => void;
  inputText: string;
}

export default function SamplePrompts({
  handleGetResultsFromSamplePrompt,
  inputText,
}: SamplePromptsProps) {
  const allPrompts = [
    'Summarize key patterns from the latest CSV file snapshot.',
    'Are there any outlier values in the CSV records?',
    'Locate duplicate entries in the current CSV dataset.',
    "Give me a list of the unique entities in this CSV data. What's the most common one?",
    'Show me all errors from parsing the last 24 hours of CSV files.',
    'Summarize what the CSV data is telling me.',
    'Find anomalies in the CSV data.',
    'Identify all missing values in the CSV files.',
    'Display summary statistics of CSV data in the past month.',
    'List all CSV rows with incomplete data from yesterday.',
    'Show data type mismatches in the last week of CSV files.',
    'Identify the columns with the most null values this week.',
    'Show all rows from today that deviate from the CSV schema.',
    'List all CSV imports that failed in the past 48 hours.',
    'Detail column value ranges in the last 3 days of CSV data.',
    'Report on trends found in CSV column data over the past week.',
    'Find all rows in the CSV files from the last 7 days that exceed threshold values.',
    'Show a summary of key metrics across all CSV files this month.',
    'List all instances of specific value occurrences in CSV files in the last 24 hours.',
    'Detail all instances of CSV data inconsistencies last night.',
    'Show a timeline of data additions to CSV files from the past week.',
    'Find all rows in CSV files related to a specific ID.',
    'Show the most frequent values in specific columns today.',
    'List all CSV rows that match a specific pattern in the last 30 days.',
    'Detail CSV file sizes and row counts for the past week.',
    'Identify patterns in data changes over the past month across CSV files.',
    'Show all CSV rows related to specific transaction errors.',
    'List all warnings generated during CSV file processing in the last two weeks.',
    'Find all occurrences of format errors in CSV files this month.',
    'Show a breakdown of data by column for a specific CSV file from yesterday.',
    'Display all user feedback recorded in CSV format in the past three days.',
    'List all CSV file updates in the last week.',
    'Detail data parsing errors detected in the past 24 hours in CSV files.',
    'Show all instances of high-value outliers in CSV files in the last 72 hours.',
    'Find all CSV files created or modified yesterday.',
    'List all anomalies detected in CSV data in the past month.',
    'Show all occurrences of data corrections in CSV files in the last week.',
    'Detail all instances of data type conversions in CSV files in the past two weeks.',
    'Identify all instances of critical data omissions in CSV files this month.',
    'Show a summary of all new columns added to CSV files last week.',
    'List all changes to data formats in CSV files in the past 30 days.',
    'Detail all instances where data integrity checks failed in CSV files.',
    'Find all rows in CSV files related to specific feature usage.',
    'Show a breakdown of numeric data by column for the past week in CSV files.',
    'List all instances of data duplication in CSV files in the last month.',
    'Detail every data cleaning activity performed on CSV files in the past two weeks.',
    'Identify all occurrences of critical data updates in CSV files this month.',
    'Show all CSV file processing logs from the last week.',
    'List all instances of data validation failures in CSV files in the past month.',
    'Detail every detected inconsistency in CSV file headers in the last 24 hours.',
    'Show a timeline of all schema changes in CSV files in the past week.',
    'Find all rows in CSV files that do not comply with the current schema.',
    'List all data transformation operations performed on CSV files this month.',
    'Detail all cases of CSV file corruption detected in the past week.',
    'Show every instance of column renaming in CSV files in the last two weeks.',
    'List all data merge operations in CSV files in the past month.',
    'Detail all detected instances of data loss in CSV file operations in the last 24 hours.',
    'Show a summary of column data types across all CSV files for the past week.',
    'List all instances of external data integration into CSV files in the past month.',
    'Detail all detected anomalies in CSV file structures in the last two weeks.',
    'Identify all schema evolutions in CSV files over the past month.',
    'Show all instances of manual data entries in CSV files in the last 24 hours.',
    'List every case of data reformatting in CSV files in the past week.',
    'Detail all instances of conditional data filtering in CSV files in the past month.',
    'Show a breakdown of value distributions by column for a specific CSV file from yesterday.',
  ].map((prompt) => ({ text: prompt, isHovering: false }));

  const { setLogSearchQuery } = useDashboardStore();
  const [prompts, setPrompts] = useState(allPrompts);
  const { themeTertiaryBgColor } = useThemeColors();

  const handleMouseEnter = (index: number) => {
    const newPrompts = [...prompts];
    newPrompts[index].isHovering = true;
    setPrompts(newPrompts);
  };

  const handleMouseLeave = (index: number) => {
    const newPrompts = [...prompts];
    newPrompts[index].isHovering = false;
    setPrompts(newPrompts);
  };

  const handleButtonClick = (text: string) => {
    handleGetResultsFromSamplePrompt(text);
  };

  const stopPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const filteredPrompts = inputText
    ? prompts
        .filter((prompt) =>
          prompt.text.toLowerCase().includes(inputText.toLowerCase()),
        )
        .slice(0, 4)
    : prompts.slice(0, 4);

  const { themeContainerBgColor } = useThemeColors();

  return (
    <div
      className='flex flex-col items-center justify-center w-full relative border-t-0 border-l-1 border-r-1 border-b-1 rounded-b-md cursor-pointer border-gray-300 bg-white shadow-md'
      onClick={stopPropagation}
    >
      {filteredPrompts.map(({ text, isHovering }, index) => (
        <button
          key={index}
          className='w-full bg-white relative'
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          onClick={() => handleButtonClick(text)}
        >
          <div className='flex items-center justify-between w-full'>
            <span className='text-xs'>{text}</span>
            <div>
              <FaArrowRight
                className={`absolute top-[50%] rounded-full bg-gray-300 ${isHovering ? 'inline' : 'none'} right-3 -translate-y-1/2 w-3 h-3`}
              />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

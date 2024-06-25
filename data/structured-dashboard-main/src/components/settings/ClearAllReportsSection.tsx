
import useReports from 'hooks/reports/useReports';

const ClearAllReportsSection = () => {
  const { deleteAllReports, isLoading } = useReports();

  return (
    <>
      <div className="flex justify-between items-center mb-2 w-full">
        <span className="text-base">Clear All Reports</span>
        <button
          className={`py-2 px-4 text-sm font-medium text-red-600 border border-transparent rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => deleteAllReports()}
          disabled={isLoading}
        >
          {isLoading ? <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg> : 'Clear'}
        </button>
      </div>
      <div className="border-t-[1px] mb-2"></div>
    </>
  );
};

export default ClearAllReportsSection;

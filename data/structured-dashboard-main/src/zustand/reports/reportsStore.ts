import create from 'zustand';
import { DataSource } from '../../interfaces/DataTypes';
import { ChartInfo } from 'components/reports/GeneratedReportContainer';
import { persist, StateStorage } from 'zustand/middleware';
import { QueryConversationItem } from 'zustand/queries/queriesStore';

export type Report = {
  reportName: string;
  question: string;
  answer: string;
  chartInfo?: ChartInfo;
  isEditing?: boolean;
  reportLoading?: boolean;
  reportPopulated?: boolean;
  reportReloading?: boolean;
  reportDataSource?: DataSource;
  id?: string;
  kpiCardInfo?: {
    title: string;
    resultEntity: string;
    result: string;
    resultConnotation: string;
  };
};

export type CompleteReport = {
  reportId: string;
  overallReportName: string;
  setReportSummary: string;
  reports: Report[];
  isReportOpen: boolean;
  isEditingOverallName?: boolean;
  reportDataSource?: DataSource;
  reportTemplate?: { id: number; name: string };
  isGenerating?: boolean;
  errorMessage?: string;
  dateCreated?: string;
  uploaderEmail?: string;
  embeddedQueryItems?: Array<{
    position: string;
    queryConversationItem: QueryConversationItem | TextBoxItem;
  }>;
  reportBoxes?: ReportBox[];
};

export type QueryConversationHistory = {
  id: string;
  conversations: QueryConversation[];
};

export type TextBoxItem = {
  id: string;
  titleText: string;
  bodyText: string;
};

export type QueryConversation = {
  id: string;
  items: QueryConversationItem[];
};

export type LayoutItemNumber = Omit<LayoutItem, 'h'> & { h: number };

export type ReportBox = {
  boxType: string;
  boxItem: QueryConversationItem | TextBoxItem;
  layout: LayoutItem;
};

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minH?: number;
  autoSize?: boolean;
}

type ReportsState = {
  addReportToHomeReportWithQuestion: (
    reportId: string,
    question: string,
  ) => void;
  setHomeReportSummary: (summary: string) => void;
  homeReport: CompleteReport | null;
  setHomeReport: (report: CompleteReport | null) => void;
  addReportToHomeReport: (report: Report) => void;
  replaceReportInHomeReport: (reportId: string, newReport: Report) => void;
  removeItemFromReportBoxes: (itemId: string) => void;
  onViewMode: boolean;
  setOnViewMode: (value: boolean) => void;
  updateTextBoxItemInReportBoxes: (
    itemId: string,
    titleText: string,
    bodyText: string,
  ) => void;
  isAddBookmarkedQueryItemsChartsModalOpen: boolean;
  setIsAddBookmarkedQueryItemsChartsModalOpen: (value: boolean) => void;
  addTextBoxToReportBoxes: (
    boxType: string,
    boxItem: TextBoxItem,
    layout: {
      i: string;
      x: number;
      y: number;
      w: number;
      h: number;
    },
  ) => void;
  reportBoxes: ReportBox[];
  setReportBoxes: (boxes: ReportBox[]) => void;
  addChartBoxToReportBoxes: (
    boxType: string,
    boxItem: QueryConversationItem,
    layout: LayoutItem,
  ) => void;
  selectedReport: CompleteReport | null;
  setSelectedReport: (report: CompleteReport | null) => void;
  reportCreationNoDataSourceSelected: boolean;
  setReportCreationNoDataSourceSelected: (value: boolean) => void;
  isCompleteReportModalOpen: boolean;
  setIsCompleteReportModalOpen: (value: boolean) => void;
  selectedReportId: string | null;
  setSelectedReportId: (reportId: string | null) => void;
  generatedReports: CompleteReport[];
  overallReportName: string;
  reportSummary: string;
  reportResponse: Report[];
  setReportResponse: (value: Report[]) => void;
  reportQuery: string;
  setReportQuery: (value: string) => void;
  toggleReportEditMode: (index: number) => void;
  updateReportName: (index: number, newName: string) => void;
  updateReportQuestion: (index: number, newQuestion: string) => void;
  setOverallReportName: (name: string) => void; // New setter for overallReportName
  isEditingOverallName: boolean;
  toggleOverallReportEditMode: () => void;
  setReportSummary: (summary: string) => void;
  reportsChosenDataSource: DataSource | null;
  setReportsChosenDataSource: (dataSource: DataSource | null) => void;
  setGeneratedReports: (generatedReports: any) => void;
  setToggleReportIsOpen: (reportId: string) => void;
  setGeneratedReportsArr: (generatedReportsArr: any) => void;
  toggleEditingOverallName: (reportId: string) => void;
  updateOverallReportName: (reportId: string, newName: string) => void;
  toggleReportReloading: (index: number) => void;
  selectedDrillDownReport: Report | null;
  setSelectedDrillDownReport: (report: Report | null) => void;
  drillingDownReport: boolean;
  setDrillingDownReport: (value: boolean) => void;
  queryReport: Report | null;
  setQueryReport: (report: Report | null) => void;
  lastQueryReport: Report | null;
  setLastQueryReport: (report: Report | null) => void;

  isDrawerOpen: boolean;
  setIsDrawerOpen: (value: boolean) => void;

  currentQueryConversation: QueryConversation | null;
  setCurrentQueryConversation: (conversation: QueryConversation | null) => void;

  isReportCreationModalOpen: boolean;
  setIsReportCreationModalOpen: (value: boolean) => void;

  isReportModalOpen: boolean;
  setIsReportModalOpen: (value: boolean) => void;

  toggleReportGenerating: (reportId: string) => void;

  replaceCompleteReport: (
    reportId: string,
    newCompleteReport: CompleteReport,
  ) => void;

  addReportToCompleteReport: (reportId: string, report: Report) => void;
  setOverallReportNameForSpecificReport: (
    reportId: string,
    overallReportName: string,
  ) => void;
  setReportSummaryForSpecificReport: (
    reportId: string,
    reportSummary: string,
  ) => void;
  replaceReportInCompleteReport: (
    completeReportId: string,
    reportId: string,
    newReport: Report,
  ) => void;
  addReportToCompleteReportWithUUID: (
    completeReportId: string,
    reportId: string,
    question: string,
    answer: string,
  ) => void;
  setCompleteReportErrorMessage: (
    completeReportId: string,
    errorMessage: string,
  ) => void;
  updateCompleteReport: (completeReport: CompleteReport) => void;
  reportsChosenTemplate: { id: number; name: string } | null;
  setReportsChosenTemplate: (
    template: { id: number; name: string } | null,
  ) => void;
  pdfDownloadMode: boolean;
  setPdfDownloadMode: (value: boolean) => void;
};

//create test complete report for home report

const homeReportTest: CompleteReport = {
  reportId: '1',
  isGenerating: false,
  overallReportName: 'Sample Report',
  setReportSummary: 'This is a sample report summary.',
  reports: [
    {
      reportName: 'Report 1',
      question: 'What is the total revenue?',
      answer: 'The total revenue is $1,000,000.',
      id: '1',
    },
    {
      reportName: 'Report 2',
      question: 'What is the average customer satisfaction score?',
      answer: 'The average customer satisfaction score is 4.5 out of 5.',
      id: '2',
    },
  ],
  isReportOpen: true,
  reportDataSource: null,
  dateCreated: '2023-05-09',
  uploaderEmail: 'user@example.com',
};

const defaultEmptyReport: CompleteReport = {
  overallReportName: 'Fetching available data sources...',
  reportId: '1',
  isGenerating: true,
  setReportSummary: '',
  isReportOpen: false,
  reports: [],
};

export const useReportsStore = create<ReportsState>()(
  persist(
    (set) => ({
      addReportToHomeReportWithQuestion: (reportId: string, question: string) =>
        set((state) => ({
          homeReport: state.homeReport
            ? {
                ...state.homeReport,
                reports: [
                  ...state.homeReport.reports,
                  {
                    id: reportId,
                    question,
                    answer: '',
                    reportName: '',
                    chartInfo: null,
                  },
                ],
              }
            : null,
        })),
      homeReport: defaultEmptyReport,
      setHomeReport: (report) => set({ homeReport: report }),
      setHomeReportSummary: (summary) =>
        set((state) => ({
          homeReport: state.homeReport
            ? { ...state.homeReport, setReportSummary: summary }
            : null,
        })),
      addReportToHomeReport: (report: Report) =>
        set((state) => ({
          homeReport: state.homeReport
            ? {
                ...state.homeReport,
                reports: [...state.homeReport.reports, report],
              }
            : null,
        })),
      replaceReportInHomeReport: (reportId: string, newReport: Report) =>
        set((state) => ({
          homeReport: state.homeReport
            ? {
                ...state.homeReport,
                reports: state.homeReport.reports.map((report) =>
                  report.id === reportId ? newReport : report,
                ),
              }
            : null,
        })),
      removeItemFromReportBoxes: (itemId: string) =>
        set((state) => ({
          reportBoxes: state.reportBoxes.filter(
            (box) => box.boxItem.id !== itemId,
          ),
        })),
      onViewMode: false,
      setOnViewMode: (value) => set({ onViewMode: value }),
      updateTextBoxItemInReportBoxes: (
        itemId: string,
        titleText: string,
        bodyText: string,
      ) =>
        set((state) => ({
          reportBoxes: state.reportBoxes.map((box) =>
            box.boxItem.id === itemId
              ? {
                  ...box,
                  boxItem: {
                    ...box.boxItem,
                    titleText,
                    bodyText,
                  },
                }
              : box,
          ),
        })),
      isAddBookmarkedQueryItemsChartsModalOpen: false,
      setIsAddBookmarkedQueryItemsChartsModalOpen: (value) =>
        set({ isAddBookmarkedQueryItemsChartsModalOpen: value }),
      selectedReport: null,
      setSelectedReport: (report) => set({ selectedReport: report }),
      isReportModalOpen: false,
      setIsReportModalOpen: (value) => set({ isReportModalOpen: value }),
      reportBoxes: [],
      setReportBoxes: (boxes) => set({ reportBoxes: boxes }),
      addChartBoxToReportBoxes: (
        boxType: string,
        boxItem: QueryConversationItem,
        layout: LayoutItem,
      ) =>
        set((state) => ({
          reportBoxes: [
            ...state.reportBoxes,
            {
              boxType,
              boxItem,
              layout,
            },
          ],
        })),
      addTextBoxToReportBoxes: (
        boxType: string,
        boxItem: TextBoxItem,
        layout: {
          i: string;
          x: number;
          y: number;
          w: number;
          h: number;
        },
      ) =>
        set((state) => ({
          reportBoxes: [
            ...state.reportBoxes,
            {
              boxType,
              boxItem,
              layout,
            },
          ],
        })),

      reportCreationNoDataSourceSelected: false,
      setReportCreationNoDataSourceSelected: (value) =>
        set({ reportCreationNoDataSourceSelected: value }),
      isCompleteReportModalOpen: false,
      setIsCompleteReportModalOpen: (value) =>
        set({ isCompleteReportModalOpen: value }),
      selectedReportId: null,
      setSelectedReportId: (reportId) => set({ selectedReportId: reportId }),
      generatedReports: [],
      overallReportName: '',
      reportSummary: '',
      reportResponse: [],
      reportsChosenTemplate: null,
      setReportsChosenTemplate: (template) =>
        set({ reportsChosenTemplate: template }),
      updateCompleteReport: (completeReport: CompleteReport) =>
        set((state) => ({
          generatedReports: state.generatedReports.map((report) =>
            report.reportId === completeReport.reportId
              ? completeReport
              : report,
          ),
        })),
      setOverallReportNameForSpecificReport: (
        reportId: string,
        overallReportName: string,
      ) =>
        set((state) => ({
          generatedReports: state.generatedReports.map((report) =>
            report.reportId === reportId
              ? { ...report, overallReportName }
              : report,
          ),
        })),
      setReportSummaryForSpecificReport: (
        reportId: string,
        reportSummary: string,
      ) =>
        set((state) => ({
          generatedReports: state.generatedReports.map((report) =>
            report.reportId === reportId
              ? { ...report, setReportSummary: reportSummary }
              : report,
          ),
        })),
      // reportResponse: mockReportResponse,
      setReportResponse: (value) => set({ reportResponse: value }),
      reportQuery: '',
      setReportQuery: (value) => set({ reportQuery: value }),
      queryReport: null,
      setQueryReport: (report) => set({ queryReport: report }),

      selectedDrillDownReport: null,
      setSelectedDrillDownReport: (report) =>
        set({ selectedDrillDownReport: report }),

      lastQueryReport: null,
      setLastQueryReport: (report) => set({ lastQueryReport: report }),

      currentQueryConversation: null,
      setCurrentQueryConversation: (conversation) =>
        set({ currentQueryConversation: conversation }),

      drillingDownReport: false,
      setDrillingDownReport: (value) => set({ drillingDownReport: value }),

      toggleReportEditMode: (index) =>
        set((state) => {
          let newReports = [...state.reportResponse];
          newReports[index] = {
            ...newReports[index],
            isEditing: !newReports[index].isEditing,
          };
          return { reportResponse: newReports };
        }),

      updateReportName: (index, newName) =>
        set((state) => {
          let newReports = [...state.reportResponse];
          newReports[index] = { ...newReports[index], reportName: newName };
          return { reportResponse: newReports };
        }),

      updateReportQuestion: (index, newQuestion) =>
        set((state) => {
          let newReports = [...state.reportResponse];
          newReports[index] = { ...newReports[index], question: newQuestion };
          return { reportResponse: newReports };
        }),

      setOverallReportName: (name) => set({ overallReportName: name }),
      isEditingOverallName: false,
      toggleOverallReportEditMode: () =>
        set((state) => ({ isEditingOverallName: !state.isEditingOverallName })),

      setReportSummary: (summary) => set({ reportSummary: summary }),

      reportsChosenDataSource: null,
      setReportsChosenDataSource: (dataSource) =>
        set({ reportsChosenDataSource: dataSource }),

      setGeneratedReports: (completeReport: CompleteReport) =>
        set((state) => ({
          generatedReports: [...state.generatedReports, completeReport],
        })),
      setToggleReportIsOpen: (reportId: string) =>
        set((state) => ({
          generatedReports: state.generatedReports.map((report) =>
            report.reportId === reportId
              ? { ...report, isReportOpen: !report.isReportOpen }
              : report,
          ),
        })),
      setGeneratedReportsArr: (generatedReportsArr) =>
        set({ generatedReports: generatedReportsArr }),

      toggleEditingOverallName: (reportId: string) =>
        set((state) => ({
          generatedReports: state.generatedReports.map((report) =>
            report.reportId === reportId
              ? {
                  ...report,
                  isEditingOverallName: !report.isEditingOverallName,
                }
              : report,
          ),
        })),

      updateOverallReportName: (reportId: string, newName: string) =>
        set((state) => ({
          generatedReports: state.generatedReports.map((report) =>
            report.reportId === reportId
              ? { ...report, overallReportName: newName }
              : report,
          ),
        })),
      toggleReportReloading: (index: number) =>
        set((state) => {
          let newReports = [...state.reportResponse];
          console.log('newReports', newReports);
          newReports[index] = {
            ...newReports[index],
            reportReloading: !newReports[index].reportReloading,
          };
          return { reportResponse: newReports };
        }),
      isDrawerOpen: false,
      setIsDrawerOpen: (value: boolean) => set({ isDrawerOpen: value }),

      isReportCreationModalOpen: false,
      setIsReportCreationModalOpen: (value: boolean) =>
        set({ isReportCreationModalOpen: value }),

      toggleReportGenerating: (reportId: string) =>
        set((state) => ({
          generatedReports: state.generatedReports.map((report) =>
            report.reportId === reportId
              ? { ...report, isGenerating: !report.isGenerating }
              : report,
          ),
        })),

      replaceCompleteReport: (
        reportId: string,
        newCompleteReport: CompleteReport,
      ) =>
        set((state) => ({
          generatedReports: state.generatedReports.map((report) =>
            report.reportId === reportId ? newCompleteReport : report,
          ),
        })),

      addReportToCompleteReport: (reportId: string, report: Report) =>
        set((state) => ({
          generatedReports: state.generatedReports.map((completeReport) =>
            completeReport.reportId === reportId
              ? {
                  ...completeReport,
                  reports: [...completeReport.reports, report],
                }
              : completeReport,
          ),
        })),
      replaceReportInCompleteReport: (
        completeReportId: string,
        reportId: string,
        newReport: Report,
      ) =>
        set((state) => ({
          generatedReports: state.generatedReports.map((completeReport) =>
            completeReport.reportId === completeReportId
              ? {
                  ...completeReport,
                  reports: completeReport.reports.map((report) =>
                    report.id === reportId ? newReport : report,
                  ),
                }
              : completeReport,
          ),
        })),
      addReportToCompleteReportWithUUID: (
        completeReportId: string,
        reportId: string,
        question: string,
        answer: string,
      ) =>
        set((state) => ({
          generatedReports: state.generatedReports.map((completeReport) =>
            completeReport.reportId === completeReportId
              ? {
                  ...completeReport,
                  reports: [
                    ...completeReport.reports,
                    {
                      id: reportId,
                      question,
                      answer,
                      reportName: '',
                      chartInfo: null,
                    },
                  ],
                }
              : completeReport,
          ),
        })),
      setCompleteReportErrorMessage: (
        completeReportId: string,
        errorMessage: string,
      ) =>
        set((state) => ({
          generatedReports: state.generatedReports.map((completeReport) =>
            completeReport.reportId === completeReportId
              ? { ...completeReport, errorMessage }
              : completeReport,
          ),
        })),
      pdfDownloadMode: false,
      setPdfDownloadMode: (value: boolean) => set({ pdfDownloadMode: value }),
    }),
    {
      name: 'reports-storage',
      getStorage: () => localStorage as StateStorage,
    },
  ),
);

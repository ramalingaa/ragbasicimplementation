// useAlertsStore.ts
import create from 'zustand';

export type Alert = {
  id: string;
  severity: string;
  time: Date;
  alertQuery: string;
  queryId: string;
  description: string;
  status: string;
};

type AlertsState = {
  alerts: Alert[];
};
export const useAlertsStore = create<AlertsState>((set) => ({
  alerts: [
    {
      id: '1',
      severity: 'high',
      time: new Date(),
      alertQuery: 'SELECT * FROM logs WHERE severity = "error"',
      queryId: 'q1',
      description: 'High severity errors in logs',
      status: 'active',
    },
    {
      id: '2',
      severity: 'low',
      time: new Date(),
      alertQuery: 'SELECT * FROM metrics WHERE value > 100',
      queryId: 'q2',
      description: 'Metrics exceeding threshold',
      status: 'active',
    },
    {
      id: '3',
      severity: 'high',
      time: new Date(),
      alertQuery: 'SELECT * FROM logs WHERE severity = "error"',
      queryId: 'q3',
      description: 'High severity errors in logs',
      status: 'active',
    },
    {
      id: '4',
      severity: 'low',
      time: new Date(),
      alertQuery: 'SELECT * FROM metrics WHERE value > 100',
      queryId: 'q4',
      description: 'Metrics exceeding threshold',
      status: 'active',
    },
    {
      id: '5',
      severity: 'high',
      time: new Date(),
      alertQuery: 'SELECT * FROM logs WHERE severity = "error"',
      queryId: 'q5',
      description: 'High severity errors in logs',
      status: 'active',
    },
    {
      id: '6',
      severity: 'medium',
      time: new Date(),
      alertQuery: 'SELECT * FROM metrics WHERE value > 100',
      queryId: 'q6',
      description: 'Metrics exceeding threshold',
      status: 'active',
    },
    {
      id: '7',
      severity: 'high',
      time: new Date(),
      alertQuery: 'SELECT * FROM logs WHERE severity = "error"',
      queryId: 'q7',
      description: 'High severity errors in logs',
      status: 'active',
    },
    {
      id: '8',
      severity: 'medium',
      time: new Date(),
      alertQuery: 'SELECT * FROM metrics WHERE value > 100',
      queryId: 'q8',
      description: 'Metrics exceeding threshold',
      status: 'active',
    },
    {
      id: '9',
      severity: 'low',
      time: new Date(),
      alertQuery: 'SELECT * FROM logs WHERE severity = "error"',
      queryId: 'q9',
      description: 'High severity errors in logs',
      status: 'active',
    },
    {
      id: '10',
      severity: 'medium',
      time: new Date(),
      alertQuery: 'SELECT * FROM metrics WHERE value > 100',
      queryId: 'q10',
      description: 'Metrics exceeding threshold',
      status: 'active',
    },
    {
      id: '11',
      severity: 'medium',
      time: new Date(),
      alertQuery: 'SELECT * FROM logs WHERE severity = "error"',
      queryId: 'q11',
      description: 'High severity errors in logs',
      status: 'active',
    },
    {
      id: '12',
      severity: 'high',
      time: new Date(),
      alertQuery: 'SELECT * FROM metrics WHERE value > 100',
      queryId: 'q12',
      description: 'Metrics exceeding threshold',
      status: 'active',
    },
  ],
}));

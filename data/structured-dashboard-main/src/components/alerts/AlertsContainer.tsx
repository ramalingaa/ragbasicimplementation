'use client';
// AlertsContainer.tsx
import React from 'react';
import { useAlertsStore } from 'zustand/alerts/useAlertsStore';

export type Alert = {
  id: string;
  severity: string;
  time: Date;
  alertQuery: string;
  queryId: string;
  description: string;
  status: string;
};

const AlertsContainer: React.FC = () => {
  const alerts = useAlertsStore((state) => state.alerts);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Alerts</h2>
      <div className="flex items-center mb-4">
        <span className="text-2xl font-bold mr-2">{alerts.length}</span>
        <span className="text-gray-500">alerts</span>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-red-100 rounded-lg p-4 flex items-center">
          <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
            <i className="fas fa-bell"></i>
          </div>
          <div>
            <div className="text-xl font-bold">7</div>
            <div className="text-sm text-red-800">Critical</div>
          </div>
        </div>
        <div className="bg-orange-100 rounded-lg p-4 flex items-center">
          <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
            <i className="fas fa-bell"></i>
          </div>
          <div>
            <div className="text-xl font-bold">11</div>
            <div className="text-sm text-orange-800">Major</div>
          </div>
        </div>
        <div className="bg-yellow-100 rounded-lg p-4 flex items-center">
          <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
            <i className="fas fa-bell"></i>
          </div>
          <div>
            <div className="text-xl font-bold">17</div>
            <div className="text-sm text-yellow-800">Minor</div>
          </div>
        </div>
        <div className="bg-purple-100 rounded-lg p-4 flex items-center">
          <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
            <i className="fas fa-bell"></i>
          </div>
          <div>
            <div className="text-xl font-bold">27</div>
            <div className="text-sm text-purple-800">Event</div>
          </div>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-xs">
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">Severity</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Alert Query</th>
            <th className="px-4 py-2">Query ID</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id} className="border-b border-gray-200">
              <td className="px-4 py-2">
                <input type="checkbox" />
              </td>
              <td className="px-4 py-2">
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                    alert.severity === 'high'
                      ? 'bg-yellow-100 text-yellow-800'
                      : alert.severity === 'medium'
                      ? 'bg-red-100 text-red-800'
                      : alert.severity === 'low'
                      ? 'bg-green-100 text-green-800'
                      : ''
                  }`}
                >
                  {alert.severity}
                </span>
              </td>
              <td className="px-4 py-2">
                <strong>{alert.time.toLocaleString()}</strong>
              </td>
              <td className="px-4 py-2">{alert.alertQuery}</td>
              <td className="px-4 py-2">{alert.queryId}</td>
              <td className="px-4 py-2">{alert.description}</td>
              <td className="px-4 py-2">{alert.status}</td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertsContainer;

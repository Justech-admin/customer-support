import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';

const TicketStatusPage = () => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  // Sample data
  const [tickets] = useState([
    {
      ticketNumber: 'TKT-202402-0001',
      status: 'In Progress',
      serialNumber: 'RJ2024/001/123',
      modelNumber: 'RJ2024/001',
      location: 'North Zone - Site A',
      incidentDate: '2024-02-15',
      createdAt: '2024-02-15T10:30:00',
      incidentDetails: 'Device showing intermittent power fluctuations during operation. Required immediate inspection and potential power supply replacement.',
      attachments: ['incident_report.pdf', 'device_photo.jpg'],
      updates: [
        {
          date: '2024-02-15T10:30:00',
          status: 'Submitted',
          comment: 'Ticket created and assigned to technical team'
        },
        {
          date: '2024-02-15T14:20:00',
          status: 'In Progress',
          comment: 'Technical team has started diagnosis'
        }
      ]
    },
    {
      ticketNumber: 'TKT-202402-0002',
      status: 'Pending',
      serialNumber: 'RJ2024/002/456',
      modelNumber: 'RJ2024/002',
      location: 'South Zone - Site B',
      incidentDate: '2024-02-16',
      createdAt: '2024-02-16T09:15:00',
      incidentDetails: 'Calibration required after recent software update. System showing deviation in expected parameters.',
      attachments: ['calibration_log.pdf'],
      updates: [
        {
          date: '2024-02-16T09:15:00',
          status: 'Submitted',
          comment: 'Ticket created'
        }
      ]
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      'Submitted': 'bg-gray-500',
      'In Progress': 'bg-blue-500',
      'Pending': 'bg-yellow-500',
      'Resolved': 'bg-green-500',
      'Closed': 'bg-purple-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleRow = (ticketNumber) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(ticketNumber)) {
      newExpandedRows.delete(ticketNumber);
    } else {
      newExpandedRows.add(ticketNumber);
    }
    setExpandedRows(newExpandedRows);
  };

  const StatusBadge = ({ status, className = '' }) => (
    <span className={`${getStatusColor(status)} text-white px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {status}
    </span>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Service Tickets</h1>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="w-8 px-4 py-3"></th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ticket Number</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Serial Number</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Created Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Last Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {tickets.map((ticket) => (
              <React.Fragment key={ticket.ticketNumber}>
                <tr 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => toggleRow(ticket.ticketNumber)}
                >
                  <td className="px-4 py-3">
                    {expandedRows.has(ticket.ticketNumber) ? 
                      <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    }
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{ticket.ticketNumber}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{ticket.location}</td>
                  <td className="px-4 py-3 text-gray-600">{ticket.serialNumber}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(ticket.createdAt)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(ticket.updates[ticket.updates.length - 1].date)}</td>
                </tr>
                {expandedRows.has(ticket.ticketNumber) && (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 bg-gray-50">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Device Information</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <p className="text-sm text-gray-600">Model: {ticket.modelNumber}</p>
                            <p className="text-sm text-gray-600">Incident Date: {ticket.incidentDate}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-2">Incident Details</h3>
                          <p className="text-sm text-gray-600">{ticket.incidentDetails}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Attachments</h3>
                          <div className="flex gap-4">
                            {ticket.attachments.map((file, index) => (
                              <div key={index} className="flex items-center text-blue-600">
                                <FileText className="w-4 h-4 mr-1" />
                                <span className="text-sm">{file}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Updates</h3>
                          <div className="space-y-2">
                            {ticket.updates.map((update, index) => (
                              <div key={index} className="text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{formatDate(update.date)}</span>
                                  <StatusBadge status={update.status} className="text-xs" />
                                </div>
                                <p className="text-gray-600 mt-1">{update.comment}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketStatusPage;

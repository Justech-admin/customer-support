import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, FileText, Loader } from 'lucide-react';

const TicketStatusPage = () => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tickets');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setTickets(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, []);

  const getStatusStyle = (status) => {
    const statusMap = {
      1: { label: 'Open', bg: 'bg-amber-500', text: 'text-white' },
      2: { label: 'In Progress', bg: 'bg-blue-500', text: 'text-white' },
      3: { label: 'Pending', bg: 'bg-amber-500', text: 'text-white' },
      4: { label: 'Resolved', bg: 'bg-emerald-500', text: 'text-white' },
      5: { label: 'Closed', bg: 'bg-purple-500', text: 'text-white' }
    };
    return statusMap[status] || statusMap[1];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatIncidentDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '/');
    } catch {
      return 'Invalid Date';
    }
  };

  const checkWarrantyStatus = (deliveryDate) => {
    if (!deliveryDate) return { 
      status: 'Unknown', 
      style: 'bg-slate-100 text-slate-800' 
    };
    
    try {
      const delivered = new Date(deliveryDate);
      const now = new Date();
      const warrantyEnd = new Date(delivered);
      warrantyEnd.setFullYear(warrantyEnd.getFullYear() + 2);
      
      if (now <= warrantyEnd) {
        const daysLeft = Math.ceil((warrantyEnd - now) / (1000 * 60 * 60 * 24));
        return {
          status: `In Warranty (${daysLeft} days left)`,
          style: 'bg-emerald-50 text-emerald-700',
          expiryDate: warrantyEnd.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        };
      } else {
        return {
          status: 'Out of Warranty',
          style: 'bg-red-50 text-red-700',
          expiryDate: warrantyEnd.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        };
      }
    } catch {
      return { 
        status: 'Error', 
        style: 'bg-slate-100 text-slate-800' 
      };
    }
  };

  const parseAttachments = (attachments) => {
    if (!attachments) return [];
    try {
      return typeof attachments === 'string' ? JSON.parse(attachments) : attachments;
    } catch (error) {
      console.error('Error parsing attachments:', error);
      return [];
    }
  };

  const toggleRow = (ticketId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(ticketId)) {
      newExpandedRows.delete(ticketId);
    } else {
      newExpandedRows.add(ticketId);
    }
    setExpandedRows(newExpandedRows);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <Loader className="w-6 h-6 text-blue-500 animate-spin" />
            <span className="ml-2 text-slate-600">Loading tickets...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">Service Tickets</h1>
          <p className="mt-2 text-sm text-slate-500">Manage and track service requests</p>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
            <p className="text-slate-500">No tickets found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="w-10 px-6 py-3"></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Ticket Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Serial Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tickets.map((ticket) => {
                    const warrantyInfo = checkWarrantyStatus(ticket.delivery_date);
                    const statusStyle = getStatusStyle(ticket.status);
                    
                    return (
                      <React.Fragment key={ticket.id}>
                        <tr 
                          className="hover:bg-slate-50 cursor-pointer transition-colors"
                          onClick={() => toggleRow(ticket.id)}
                        >
                          <td className="px-6 py-4">
                            {expandedRows.has(ticket.id) ? 
                              <ChevronDown className="w-4 h-4 text-slate-400" /> : 
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            {ticket.ticket_number || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {ticket.serial_number || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {formatDate(ticket.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {ticket.reporter || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {ticket.location || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                              {statusStyle.label}
                            </span>
                          </td>
                        </tr>
                        {expandedRows.has(ticket.id) && (
                          <tr className="bg-slate-50">
                            <td colSpan={7} className="px-6 py-4">
                              <div className="grid grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-6">
                                  {/* Reporter Details */}
                                  <div>
                                    <h3 className="text-sm font-medium text-slate-900 mb-3">Reporter Details</h3>
                                    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Name</span>
                                        <span className="text-sm font-medium text-slate-900">{ticket.reporter || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Contact</span>
                                        <span className="text-sm font-medium text-slate-900">{ticket.contact_number || 'N/A'}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Device Information */}
                                  <div>
                                    <h3 className="text-sm font-medium text-slate-900 mb-3">Device Information</h3>
                                    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Serial Number</span>
                                        <span className="text-sm font-medium text-slate-900">{ticket.serial_number || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Delivery Date</span>
                                        <span className="text-sm font-medium text-slate-900">{formatDate(ticket.delivery_date)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Frequencies</span>
                                        <span className="text-sm font-medium text-slate-900">{ticket.frequencies || 'N/A'}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Warranty Status */}
                                  <div>
                                    <h3 className="text-sm font-medium text-slate-900 mb-3">Warranty Status</h3>
                                    <div className={`rounded-lg p-4 ${warrantyInfo.style}`}>
                                      <div className="font-medium">{warrantyInfo.status}</div>
                                      {warrantyInfo.expiryDate && (
                                        <div className="text-xs mt-1">
                                          Warranty expiry: {warrantyInfo.expiryDate}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                  {/* Incident Details */}
                                  <div>
                                    <h3 className="text-sm font-medium text-slate-900 mb-3">Incident Details</h3>
                                    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Date</span>
                                        <span className="text-sm font-medium text-slate-900">
                                          {formatIncidentDate(ticket.incident_date)}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-sm text-slate-500">Description</span>
                                        <p className="mt-1 text-sm text-slate-900 whitespace-pre-line">
                                          {ticket.incident_details || 'No details provided'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Attachments */}
                                  <div>
                                    <h3 className="text-sm font-medium text-slate-900 mb-3">Attachments</h3>
                                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                                      {parseAttachments(ticket.attachments).length > 0 ? (
                                        <div className="flex flex-wrap gap-3">
                                          {parseAttachments(ticket.attachments).map((file, index) => (
                                            <div 
                                              key={index}
                                              className="flex items-center px-3 py-2 rounded-md bg-blue-50 text-blue-700"
                                            >
                                              <FileText className="w-4 h-4 mr-2" />
                                              <span className="text-sm font-medium">{file.split('/').pop()}</span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-slate-500">No attachments available</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Updates */}
                                  <div>
                                    <h3 className="text-sm font-medium text-slate-900 mb-3">Updates</h3>
                                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                                      <p className="text-sm text-slate-900 whitespace-pre-line">
                                        {ticket.updates || 'No updates available'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketStatusPage;

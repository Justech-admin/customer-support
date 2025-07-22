import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { ChevronDown, ChevronRight, FileText, Loader } from 'lucide-react';

const TicketStatusPage = () => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');


  

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tickets');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        setTickets(data.tickets);     
        // setEngineers(data.engineers); // ✅ new
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
      2: { label: 'Service Under Progress', bg: 'bg-blue-500', text: 'text-white' },
      3: { label: 'Service Completed', bg: 'bg-amber-500', text: 'text-white' },
      4: { label: 'Pending', bg: 'bg-emerald-500', text: 'text-white' },
      5: { label: 'Resolved', bg: 'bg-purple-500', text: 'text-white' }
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
  const filteredAndSortedTickets = tickets
  .filter((ticket) => {
    return statusFilter === '' || ticket.status === parseInt(statusFilter);
  })
  .sort((a, b) => {
    return sortOrder === 'asc' ? a.status - b.status : b.status - a.status;
  });


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
        <div className='mb-6'>
            <h1 className="text-2xl font-bold text-black">Service Tickets</h1>
            <p className="text-gray-600">Manage and track your service tickets.</p>
        </div>
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <div className="ml-auto ">
            <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Status</label>
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-300 rounded px-3 py-2 text-sm"
              >
              <option value="">All</option>
              <option value="1">Open</option>
              <option value="2">Service Under Progress</option>
              <option value="3">Service Completed</option>
              <option value="4">Pending</option>
              <option value="5">Resolved</option>
            </select>
          </div>

          <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sort by Status</label>
                <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-slate-300 rounded px-3 py-2 text-sm"
              >
              <option value="asc">Opened</option>
              <option value="desc">Resolved</option>
            </select>
          </div>
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
                  {filteredAndSortedTickets.map((ticket) => {
                    const warrantyInfo = checkWarrantyStatus(ticket.delivery_date);
                    const statusStyle = getStatusStyle(ticket.status);
                    
                    return (
                      <React.Fragment key={ticket.id}>
                        <tr 
                          className="hover:bg-slate-50 cursor-pointer transition-colors"
                          onClick={() => toggleRow(ticket.id)}
                        >
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            {ticket.ticket_number || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
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

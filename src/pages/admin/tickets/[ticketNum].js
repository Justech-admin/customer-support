import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebaradmin";
import { withAuth } from "../../../utils/withAuth";
import { 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Hash, 
  Calendar, 
  UserCheck, 
  FileText, 
  Paperclip,
  AlertCircle,
  CheckCircle,
  Settings,
  Pause,
  XCircle,
  ChevronDown
} from "lucide-react";

const TicketPreview = () => {
  const router = useRouter();
  const { ticketNum } = router.query;

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState('');
  const [engineer, setEngineer] = useState('');
  const [engineers, setEngineers] = useState([]);
  const [engineerName, setEngineerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [engineersLoading, setEngineersLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const defaultEmailMessages = {
    // "1": "Your ticket has been opened and is under review.",
    "2": "Your ticket is now being serviced by our team.",
    "3": "Service has been completed. Please confirm resolution.",
    "4": "Your ticket is pending due to additional requirements.",
    "5": "Your ticket has been resolved. Thank you for your patience.",
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    setEmailBody(defaultEmailMessages[newStatus] || '');
  };

  const handleSendMail = async () => {
    try {
      setIsSendingEmail(true);

      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateStatusAndNotify',
          ticketId: ticket.ticket_number,
          status: selectedStatus,
          emailBody,
        }),
      });

      if (!res.ok) throw new Error("Failed to send email");

      alert('Email sent and status updated!');
      setStatus(selectedStatus);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSendingEmail(false);
    }
  };




  // Status configuration with colors and icons
  const statusConfig = {
    "1": { label: "Inspection Report and Quotation", color: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle },
    "2": { label: "Service Under Progress", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Settings },
    "3": { label: "Service Completed", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
    "4": { label: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Pause },
    "5": { label: "Resolved", color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle }
  };

  // Fetch ticket details and engineers
  useEffect(() => {
    if (!ticketNum) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setEngineersLoading(true);
        
        const res = await fetch(`/api/tickets?ticketId=${ticketNum}`);
        if (!res.ok) throw new Error("Ticket not found");

        const data = await res.json();
        const ticketData = Array.isArray(data.tickets) ? data.tickets[0] : null;
        if (!ticketData) throw new Error("Ticket not found");

        setTicket(ticketData);
        setStatus(ticketData.status?.toString() || "1");
        setEngineer(ticketData.assigned_engineer_id?.toString() || "");
        setEngineerName(ticketData.assigned_engineer_name || "");

        
        // Set engineers from the API response
        if (data.engineers) {
          setEngineers(data.engineers);
        }
        setEngineersLoading(false);
      } catch (err) {
        setError(err.message);
        setEngineersLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticketNum]);



  // Assign engineer
  const handleUpdate = async () => {
    if (!engineer) {
      alert("Please select an engineer");
      return;
    }

    try {
      setIsUpdating(true);

      const res = await fetch(`/api/tickets?ticketId=${ticketNum}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          engineerId: parseInt(engineer),
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      
      const updated = await res.json();
      
      
      // Success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Engineer assigned successfully!';
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);

    } catch (err) {
      // ❌ Error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = `Error: ${err.message}`;
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    } finally {
      setIsUpdating(false);
    }
  };


 

  const InfoCard = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-lg font-semibold text-gray-900 truncate">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="fixed left-0 top-0 h-full z-30">
          <Sidebar collapsed={false} />
        </div>
        <div className="flex-1 ml-64 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading ticket details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="fixed left-0 top-0 h-full z-30">
          <Sidebar collapsed={false} />
        </div>
        <div className="flex-1 ml-64 flex justify-center items-center">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Ticket</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[status]?.icon || AlertCircle;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar collapsed={false} />
      </div>
      
      {/* Main Content with left margin to account for fixed sidebar */}
      <div className="flex-1 ml-64 p-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ticket #{ticket.ticket_number}
              </h1>
              <p className="text-gray-600 mt-1">
                Created on {new Date(ticket.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig[status]?.color}`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusConfig[status]?.label}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Ticket Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-500" />
                Ticket Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard icon={Hash} label="Serial Number" value={ticket.serial_number} />
                <InfoCard icon={User} label="Reporter" value={ticket.reporter} />
                <InfoCard icon={MapPin} label="Location" value={ticket.location} />
                <InfoCard icon={Phone} label="Contact Number" value={ticket.contact_number} />
                <InfoCard icon={UserCheck} label="Designation" value={ticket.designation} />
                <InfoCard icon={Calendar} label="Created At" value={new Date(ticket.created_at).toLocaleString()} />
              </div>
            </div>

            {/* Incident Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-gray-500" />
                Incident Details
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {ticket.incident_details}
                </p>
              </div>
            </div>

            {/* Updates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-500" />
                Updates & Notes
              </h2>
              <div className="mt-6 border-t pt-4">
                <label className="block font-medium text-gray-700 mb-1">Update Ticket Status</label>
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-3"
                >
                  <option value="">Select status</option>
                  {Object.entries(statusConfig).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>

                <label className="block font-medium text-gray-700 ">Email Body</label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4"
                />

                <div className="my-6 ">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Status Timeline</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>
                      <span className="font-semibold">Ticket Created:</span> {new Date(ticket.created_at).toLocaleString()}
                    </li>
                    {ticket.service_under_progress_at && (
                      <li>
                        <span className="font-semibold">Service Under Progress:</span> {new Date(ticket.service_under_progress_at).toLocaleString()}
                      </li>
                    )}
                    {ticket.service_completed_at && (
                      <li>
                        <span className="font-semibold">Service Completed:</span> {new Date(ticket.service_completed_at).toLocaleString()}
                      </li>
                    )}
                    {ticket.pending_at && (
                      <li>
                        <span className="font-semibold">Pending:</span> {new Date(ticket.pending_at).toLocaleString()}
                      </li>
                    )}
                    {ticket.resolved_at && (
                      <li>
                        <span className="font-semibold">Resolved:</span> {new Date(ticket.resolved_at).toLocaleString()}
                      </li>
                    )}
                  </ul>
                </div>


                <button
                  onClick={handleSendMail}
                  disabled={!selectedStatus || !emailBody || isSendingEmail}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg"
                >
                  {isSendingEmail ? 'Sending...' : 'Send Email & Update Status'}
                </button>
              </div>

            </div>

            {/* Attachments */}
            {ticket.attachments && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Paperclip className="w-5 h-5 mr-2 text-gray-500" />
                  Attachments
                </h2>
                <div className="space-y-2">
                  {JSON.parse(ticket.attachments).map((file, index) => (
                    <a
                      key={index}
                      href={`/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <Paperclip className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-blue-600 group-hover:text-blue-800 font-medium">
                        {file.split('/').pop()}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Assignment Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-gray-500" />
                Assignment
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Engineer
                  </label>
                  <div className="relative">
                    

                    <select
                      value={engineer}
                      onChange={(e) => setEngineer(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white pr-10"
                      disabled={engineersLoading}
                    >
                      <option value="">
                        {engineersLoading ? "Loading engineers..." : "Select an engineer"}
                      </option>
                      {engineers.map((eng) => (
                        <option key={eng.engineer_id} value={eng.engineer_id}>
                          {eng.name} - ID: {eng.engineer_id}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Select an engineer from the dropdown to assign this ticket
                  </p>
                </div>

                {/* Display currently assigned engineer if any */}
                {ticket.assigned_engineer_id && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Currently assigned to:</span> Engineer ID {ticket.assigned_engineer_id}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleUpdate}
                  disabled={isUpdating || !engineer || engineersLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Assigning...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Assign Engineer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = withAuth();

export default TicketPreview;

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import { withAuth } from "../../../utils/withAuth";

const TicketPreview = () => {
  const router = useRouter();
  const { ticketNum } = router.query;

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState('');
  const [engineer, setEngineer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ticket details
  useEffect(() => {
    if (!ticketNum) return;

    const fetchTicket = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/tickets?ticketId=${ticketNum}`);
        if (!res.ok) throw new Error("Ticket not found");

        const data = await res.json();
        const ticketData = Array.isArray(data.tickets) ? data.tickets[0] : null;
        if (!ticketData) throw new Error("Ticket not found");

        setTicket(ticketData);
        setStatus(ticketData.status?.toString() || "1");
        setEngineer(ticketData.assigned_engineer_id?.toString() || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketNum]);

  // Assign engineer
  const handleUpdate = async () => {
    try {
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
      alert("Engineer assigned successfully");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={false} />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Ticket #{ticket.ticket_number}</h1>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div><strong>Serial Number:</strong> {ticket.serial_number}</div>
          <div><strong>Reporter:</strong> {ticket.reporter}</div>
          <div><strong>Location:</strong> {ticket.location}</div>
          <div><strong>Created At:</strong> {new Date(ticket.created_at).toLocaleString()}</div>
          <div><strong>Designation:</strong> {ticket.designation}</div>
          <div><strong>Contact Number:</strong> {ticket.contact_number}</div>
        </div>

        <div className="mt-6">
          <label className="block mb-1 font-semibold">Assign Engineer (by ID)</label>
          <input
            type="number"
            value={engineer}
            onChange={(e) => setEngineer(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full max-w-sm"
            placeholder="Enter engineer ID"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-1 font-semibold">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full max-w-sm"
            disabled // disable if only assignment is allowed
          >
            <option value="1">Open</option>
            <option value="2">Service Under Progress</option>
            <option value="3">Service Completed</option>
            <option value="4">Pending</option>
            <option value="5">Resolved</option>
          </select>
        </div>

        <button
          onClick={handleUpdate}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Assign Engineer
        </button>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Incident Details</h2>
          <p className="text-gray-700">{ticket.incident_details}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Updates</h2>
          {ticket.updates ? (
            <p className="text-gray-700">{ticket.updates}</p>
          ) : (
            <p className="text-gray-500">No updates yet.</p>
          )}
        </div>

        {ticket.attachments && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Attachments</h2>
            {JSON.parse(ticket.attachments).map((file, index) => (
              <a
                key={index}
                href={`/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 underline text-sm"
              >
                {file.split('/').pop()}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = withAuth();

export default TicketPreview;

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Calendar, MapPin, AlertCircle, Clock, Users, Wrench, TrendingUp, Filter } from 'lucide-react';
import { parseISO, format, formatDistanceToNow } from 'date-fns';

const AdminDashboard = () => {

  const [statusData, setStatusData] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [ticketView, setTicketView] = useState("monthly");
  const [locationTicketData, setLocationTicketData] = useState([]);
  const [frequentIssuesData, setFrequentIssuesData] = useState([]);


  //Fetch all tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets");
        const data = await res.json();
        setAllTickets(data);
      } catch (err) {
        console.error("Failed to fetch ticket data:", err);
      }
    };

    fetchTickets();
  }, []);

  //Status data
  useEffect(() => {
    // if (allTickets.length === 0) return;

    const statusCount = allTickets.reduce((acc, ticket) => {
      const status = ticket.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    

    const statusMap = {
      1: { name: 'Open', color: '#ef4444' },
      2: { name: 'Service Under Progress', color: '#f59e0b' },
      3: { name: 'Service Completed', color: '#10b981' },
      4: { name: 'Pending', color: '#000050' },
      5: { name: 'Resolved', color: '#6b7280' }
    };

    const formattedData = Object.entries(statusCount).map(([status, count]) => ({
      ...statusMap[status],
      value: count
    }));

    setStatusData(formattedData);
  }, [allTickets]);

  //top tiles
  const totalTickets = statusData.reduce((sum, s) => sum + s.value, 0);
  const resolvedTickets = statusData.find(s => s.name === 'Resolved')?.value || 0;
  // median timee
  const thisMonthTicketCount = allTickets?.length
  ? allTickets.filter(ticket => {
      const createdAt = new Date(ticket.created_at);
      const now = new Date();
      return (
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear()
      );
    }).length
  : 0;


  //Tickets by location
  useEffect(() => {
  // if (allTickets.length === 0) return;

  const locationCounts = {};

  allTickets.forEach(ticket => {
    const loc = ticket.location || "Unknown";
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });

  const chartData = Object.entries(locationCounts).map(([name, tickets]) => ({
    name,
    tickets
  }));

  setLocationTicketData(chartData);
}, [allTickets]);



  //Frequent issues >once
  useEffect(() => {
  // if (allTickets.length === 0) return;

    const issueMap = {};

    allTickets.forEach(ticket => {
      const serial = ticket.serial_number || "Unknown";
      const createdAt = new Date(ticket.created_at);

      if (!issueMap[serial]) {
        issueMap[serial] = {
          serial,
          tickets: 1,
          lastCreatedAt: createdAt,
        };
      } else {
        issueMap[serial].tickets += 1;

        if (createdAt > issueMap[serial].lastCreatedAt) {
          issueMap[serial].lastCreatedAt = createdAt;
        }
      }
    });

    const sorted = Object.values(issueMap)
      .filter(item => item.tickets > 1) // only show frequent issues
      .sort((a, b) => b.tickets - a.tickets)
      .slice(0, 5)
      .map(item => ({
        serial: item.serial,
        tickets: item.tickets,
        lastIssue: formatDistanceToNow(item.lastCreatedAt, { addSuffix: true }),
      }));

    setFrequentIssuesData(sorted);
  }, [allTickets]);

   

  //Monthly,quartely,yearly,past 6 months
  const getTicketData = (view) => {
    const grouped = {};

    allTickets.forEach(ticket => {
      const createdAt = parseISO(ticket.created_at);

      let key;
      if (view === "monthly") {
        key = format(createdAt, "MMM yyyy");  // e.g. "Jul 2025"
      } 
      else if (view === "quarterly") {
        const quarter = Math.floor(createdAt.getMonth() / 3) + 1;
        key = `Q${quarter} ${createdAt.getFullYear()}`;
      } 
      else if (view === "last6months") {
        key = format(createdAt, "MMM yyyy");
      } else if (view === "financial") {
        const fy = createdAt.getMonth() >= 3
          ? `FY ${createdAt.getFullYear()}-${createdAt.getFullYear() + 1}`
          : `FY ${createdAt.getFullYear() - 1}-${createdAt.getFullYear()}`;
        key = fy;
      }

      if (key) {
        grouped[key] = (grouped[key] || 0) + 1;
      }
    });

    // sort keys chronologically
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      if (view === "financial") return a.localeCompare(b); // FY sorting
      return new Date(a) - new Date(b);
    });

    let data = sortedKeys.map(k => ({
      month: k,
      tickets: grouped[k]
    }));

    if (view === "last6months") {
      data = data.slice(-6); // last 6 entries
    }

    return data;
  };


  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-black text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold mt-2 ${color === 'green' ? 'text-green-400' : color === 'red' ? 'text-red-400' : color === 'yellow' ? 'text-yellow-400' : 'text-blue-400'}`}>
            {value}
          </p>
          {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <Icon className={`w-8 h-8 ${color === 'green' ? 'text-green-400' : color === 'red' ? 'text-red-400' : color === 'yellow' ? 'text-yellow-400' : 'text-blue-400'}`} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-50 border-slate-200 p-6">
        
         <div>
            <h1 className="text-2xl font-bold text-black">Analytics Dashboard</h1>
            <p className="text-gray-600">Get insights on your products and services.</p>
         </div>
          
          
      </div>

      {/* STAT CARD */}
      <div className="p-6 space-y-6">
        {/* Overview Ticket Stats */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard 
            title="Total Tickets" 
            value= {totalTickets}
            subtitle="Across all jammers and locations"
            icon={Wrench} 
            color="blue" 
         />
         <StatCard 
            title="Resolved Tickets" 
            value= {resolvedTickets} 
            subtitle="Resolved within timeframe"
            icon={TrendingUp} 
            color="green" 
         />
         <StatCard 
            title="Median Resolution Time" 
            value="6.5 days" 
            subtitle="Across resolved tickets"
            icon={Clock} 
            color="yellow" 
         />
         <StatCard 
            title="Tickets This Month" 
            value={thisMonthTicketCount} 
            subtitle="July 2025 activity"
            icon={Users} 
            color="purple" 
         />
         </div>


        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


          {/* Ticket Volume Over Time */}
         <div className="bg-white rounded-lg p-6 border border-slate-200">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
               <Calendar className="w-5 h-5" />
               Ticket Volume Over Time
            </h3>

            {/* View Dropdown */}
            <select
               value={ticketView}
               onChange={(e) => setTicketView(e.target.value)}
               className="border px-3 py-1 rounded text-sm"
            >
               <option value="monthly">Monthly </option>
               <option value="quarterly">Quarterly</option>
               <option value="last6months">Last 6 Months</option>
               <option value="financial">Financial Yearly</option>

            </select>
         </div>

         <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getTicketData(ticketView)}>
               <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
               <XAxis dataKey="month" stroke="#9ca3af" />
               <YAxis stroke="#9ca3af" />
               <Tooltip 
               contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
               }} 
               />
               <Line 
               type="monotone" 
               dataKey="tickets" 
               stroke="#3b82f6" 
               strokeWidth={2}
               dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
               />
            </LineChart>
         </ResponsiveContainer>
         </div>


          {/* Tickets by Status */}
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Tickets by Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name}\n`+percent*100+`%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#D3D3D3', 
                    // border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>          
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Frequent Issues */}        
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Frequent Issues
            </h3>
            <div className="space-y-3">
              {frequentIssuesData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {item.tickets}
                    </div>
                    <div>
                      <p className="font-medium">{item.serial}</p>
                      <p className="text-sm text-slate-500">Last issue: {item.lastIssue}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-red-400 font-medium">{item.tickets} tickets</p>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Tickets by Location */}
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Tickets by Location
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationTicketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="tickets" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';

const MaintenanceDashboard = () => {
  const [timeRange, setTimeRange] = useState('3month');
  const [loading, setLoading] = useState(true);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [totalJammers, setTotalJammers] = useState(0);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/maintenance-stats');
        const data = await response.json();
        setMaintenanceData(data);
        
        // Get total count of jammers (assuming all serial numbers are unique)
        const total = data.length;
        setTotalJammers(total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Prepare current month chart data showing completed vs remaining
  const currentMonthData = useMemo(() => {
    if (!maintenanceData || maintenanceData.length === 0) return [];
    
    // Count completed maintenance for each type
    const batteryDone = maintenanceData.filter(item => item.battery_maintenance_date && item.battery_maintenance_date !== 'NULL').length;
    const physicalDone = maintenanceData.filter(item => item.physical_inspection_date && item.physical_inspection_date !== 'NULL').length;
    const functionalDone = maintenanceData.filter(item => item.functional_test_date && item.functional_test_date !== 'NULL').length;
    
    console.log("Calculated values:", {
      batteryDone,
      physicalDone,
      functionalDone,
      totalJammers
    });
    
    return [
      {
        name: 'Battery',
        Done: batteryDone,
        Remaining: totalJammers - batteryDone,
      },
      {
        name: 'Physical',
        Done: physicalDone,
        Remaining: totalJammers - physicalDone,
      },
      {
        name: 'Functional',
        Done: functionalDone,
        Remaining: totalJammers - functionalDone,
      }
    ];
  }, [maintenanceData, totalJammers]);

  // Prepare trend data (simplified since we're focusing on current month)
  const trendData = useMemo(() => {
    // This is a simplified version since we're focusing on the current month display
    // You might want to modify this based on your actual trend data needs
    return [
      { month: 'Jul', battery: 15, physical: 10, functional: 12 },
      { month: 'Aug', battery: 18, physical: 15, functional: 16 },
      { month: 'Sep', battery: 20, physical: 18, functional: 19 },
    ];
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Handle stacked bar chart data (Current Month Status)
      if (payload.some(item => item.name === 'Done')) {
        const done = payload.find(item => item.name === 'Done')?.value || 0;
        const remaining = payload.find(item => item.name === 'Remaining')?.value || 0;
        const percentage = totalJammers > 0 ? Math.round((done / totalJammers) * 100) : 0;
        
        return (
          <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-2xl">
            <p className="text-slate-200 font-medium mb-2">{label} Maintenance</p>
            <p className="text-blue-400">Done: {done} ({percentage}%)</p>
            <p className="text-slate-400">Remaining: {remaining}</p>
            <p className="text-slate-500 text-xs mt-1">Total: {totalJammers}</p>
          </div>
        );
      }
      // Handle line chart data (Maintenance Trends)
      else {
        return (
          <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-2xl">
            <p className="text-slate-200 font-medium mb-2">{label}</p>
            {payload.map((item, index) => (
              <p key={index} className="text-slate-200" style={{ color: item.color }}>
                {item.name}: {item.value}
              </p>
            ))}
          </div>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Maintenance Dashboard</h1>
            <p className="text-slate-500">Monitor and manage all maintenance activities</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Current Month Status Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Current Month Status</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <Activity className="h-4 w-4" />
                <span>Total Jammers: {totalJammers}</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={currentMonthData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  stackOffset="expand"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Done" stackId="a" fill="#3b82f6" name="Completed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Remaining" stackId="a" fill="#e2e8f0" name="Remaining" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Maintenance Trends Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Maintenance Trends</h3>
              <div className="flex items-center space-x-2">
                <select
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="3month">Last 3 Months</option>
                  <option value="6month">Last 6 Months</option>
                  <option value="1year">Last 1 Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="battery" stroke="#00F5A0" strokeWidth={2} name="Battery" />
                  <Line type="monotone" dataKey="functional" stroke="#3b82f6" strokeWidth={2} name="Functional" />
                  <Line type="monotone" dataKey="physical" stroke="#FD6C9E" strokeWidth={2} name="Physical" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;

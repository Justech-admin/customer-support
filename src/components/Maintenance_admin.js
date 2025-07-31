import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Calendar, AlertTriangle, CheckCircle, Clock, Filter, Activity, TrendingUp } from 'lucide-react';

const MaintenanceDashboard = () => {
  const [selectedMaintenanceType, setSelectedMaintenanceType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('3month'); // '3month', '6month', '1year', 'all'

  // Sample data - replace with your actual data
  const sampleData = {
    batteryMaintenance: [
      { id: 1, serial_number: 'RJ001', maintenance_date: '2024-01-15', battery_condition: 'Good', no_leakage: true, easily_seated: true, adequate_level: true, secure_connections: true, charger_functions: true, display_functions: true, accurate_indicators: true, no_flickering: true, name: 'John Doe', designation: 'Tech Lead', status: 'Completed' },
      { id: 2, serial_number: 'RJ002', maintenance_date: '2024-01-20', battery_condition: 'Fair', no_leakage: true, easily_seated: false, adequate_level: true, secure_connections: true, charger_functions: true, display_functions: true, accurate_indicators: false, no_flickering: true, name: 'Jane Smith', designation: 'Technician', status: 'Needs Attention' },
      { id: 3, serial_number: 'RJ003', maintenance_date: null, battery_condition: null, status: 'Pending' },
      { id: 4, serial_number: 'RJ004', maintenance_date: '2024-01-25', battery_condition: 'Excellent', no_leakage: true, easily_seated: true, adequate_level: true, secure_connections: true, charger_functions: true, display_functions: true, accurate_indicators: true, no_flickering: true, name: 'Mike Johnson', designation: 'Senior Tech', status: 'Completed' },
      { id: 5, serial_number: 'RJ005', maintenance_date: null, battery_condition: null, status: 'Pending' },
      // Recent month data
      { id: 6, serial_number: 'RJ006', maintenance_date: '2024-06-10', battery_condition: 'Good', status: 'Completed' },
      { id: 7, serial_number: 'RJ007', maintenance_date: '2024-06-15', battery_condition: 'Good', status: 'Completed' },
      { id: 8, serial_number: 'RJ008', maintenance_date: null, battery_condition: null, status: 'Pending' },
    ],
    functionalTest: [
      { id: 1, serial_number: 'RJ001', maintenance_date: '2024-01-16', powers_correctly: true, trigger_functions: true, jamming_activates: true, jamming_range: 'Excellent', name: 'Alice Brown', designation: 'Test Engineer', status: 'Completed' },
      { id: 2, serial_number: 'RJ002', maintenance_date: '2024-01-21', powers_correctly: true, trigger_functions: false, jamming_activates: true, jamming_range: 'Good', name: 'Bob Wilson', designation: 'Technician', status: 'Needs Attention' },
      { id: 3, serial_number: 'RJ003', maintenance_date: null, status: 'Pending' },
      { id: 4, serial_number: 'RJ004', maintenance_date: '2024-01-26', powers_correctly: true, trigger_functions: true, jamming_activates: true, jamming_range: 'Excellent', name: 'Carol Davis', designation: 'Senior Engineer', status: 'Completed' },
      { id: 5, serial_number: 'RJ005', maintenance_date: null, status: 'Pending' },
      // Recent month data
      { id: 6, serial_number: 'RJ006', maintenance_date: '2024-06-12', status: 'Completed' },
      { id: 7, serial_number: 'RJ007', maintenance_date: null, status: 'Pending' },
    ],
    physicalInspection: [
      { id: 1, serial_number: 'RJ001', inspection_date: '2024-01-17', no_visible_cracks: true, clean_surface: true, no_corrosion: true, buttons_intact: true, strap_intact: true, no_fraying: true, secure_attachment: true, bag_no_damage: true, zippers_function: true, clean_interior: true, compartments_intact: true, name: 'David Lee', designation: 'Inspector', status: 'Completed' },
      { id: 2, serial_number: 'RJ002', inspection_date: '2024-01-22', no_visible_cracks: true, clean_surface: false, no_corrosion: true, buttons_intact: true, strap_intact: false, no_fraying: false, secure_attachment: true, bag_no_damage: true, zippers_function: true, clean_interior: false, compartments_intact: true, name: 'Sarah Miller', designation: 'Quality Inspector', status: 'Needs Attention' },
      { id: 3, serial_number: 'RJ003', inspection_date: null, status: 'Pending' },
      { id: 4, serial_number: 'RJ004', inspection_date: '2024-01-27', no_visible_cracks: true, clean_surface: true, no_corrosion: true, buttons_intact: true, strap_intact: true, no_fraying: true, secure_attachment: true, bag_no_damage: true, zippers_function: true, clean_interior: true, compartments_intact: true, name: 'Tom Anderson', designation: 'Senior Inspector', status: 'Completed' },
      { id: 5, serial_number: 'RJ005', inspection_date: null, status: 'Pending' },
      // Recent month data
      { id: 6, serial_number: 'RJ006', inspection_date: '2024-06-18', status: 'Completed' },
      { id: 7, serial_number: 'RJ007', inspection_date: null, status: 'Pending' },
    ],
    rifleJammer: [
      { id: 1, serial_number: 'RJ001', location_id: 'LOC001', user_id: 'USER001', client_status: 'Active', type: 'Portable', manufacturing_date: '2023-06-15', delivery_date: '2023-07-01', admin_status: 'Operational' },
      { id: 2, serial_number: 'RJ002', location_id: 'LOC002', user_id: 'USER002', client_status: 'Active', type: 'Fixed', manufacturing_date: '2023-07-20', delivery_date: '2023-08-05', admin_status: 'Maintenance Required' },
      { id: 3, serial_number: 'RJ003', location_id: 'LOC003', user_id: 'USER003', client_status: 'Inactive', type: 'Portable', manufacturing_date: '2023-08-10', delivery_date: '2023-08-25', admin_status: 'Pending Maintenance' },
      { id: 4, serial_number: 'RJ004', location_id: 'LOC004', user_id: 'USER004', client_status: 'Active', type: 'Mobile', manufacturing_date: '2023-09-05', delivery_date: '2023-09-20', admin_status: 'Operational' },
      { id: 5, serial_number: 'RJ005', location_id: 'LOC005', user_id: 'USER005', client_status: 'Active', type: 'Portable', manufacturing_date: '2023-10-12', delivery_date: '2023-10-27', admin_status: 'Pending Maintenance' }
    ]
  };

  // Calculate summary statistics for recent month only (Pending vs Completed)
  const recentMonthStats = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const filterRecentMonth = (item) => {
      if (!item.maintenance_date && !item.inspection_date) return item.status === 'Pending';
      
      const dateStr = item.maintenance_date || item.inspection_date;
      const date = new Date(dateStr);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    };

    const batteryStats = {
      completed: sampleData.batteryMaintenance.filter(item => 
        filterRecentMonth(item) && item.status === 'Completed'
      ).length,
      pending: sampleData.batteryMaintenance.filter(item => 
        filterRecentMonth(item) && item.status === 'Pending'
      ).length
    };

    const functionalStats = {
      completed: sampleData.functionalTest.filter(item => 
        filterRecentMonth(item) && item.status === 'Completed'
      ).length,
      pending: sampleData.functionalTest.filter(item => 
        filterRecentMonth(item) && item.status === 'Pending'
      ).length
    };

    const physicalStats = {
      completed: sampleData.physicalInspection.filter(item => 
        filterRecentMonth(item) && item.status === 'Completed'
      ).length,
      pending: sampleData.physicalInspection.filter(item => 
        filterRecentMonth(item) && item.status === 'Pending'
      ).length
    };

    return { batteryStats, functionalStats, physicalStats };
  }, []);

  // Prepare chart data for recent month (Pending vs Completed only)
  const recentMonthChartData = [
    {
      name: 'Battery',
      completed: recentMonthStats.batteryStats.completed,
      pending: recentMonthStats.batteryStats.pending,
      type: 'battery'
    },
    {
      name: 'Functional',
      completed: recentMonthStats.functionalStats.completed,
      pending: recentMonthStats.functionalStats.pending,
      type: 'functional'
    },
    {
      name: 'Physical',
      completed: recentMonthStats.physicalStats.completed,
      pending: recentMonthStats.physicalStats.pending,
      type: 'physical'
    }
  ];

  // Filter trend data based on selected time range
  const filteredTrendData = useMemo(() => {
    const allTrendData = [
      { month: 'Jan', battery: 40, functional: 45, physical: 35 },
      { month: 'Feb', battery: 50, functional: 55, physical: 42 },
      { month: 'Mar', battery: 65, functional: 70, physical: 60 },
      { month: 'Apr', battery: 80, functional: 85, physical: 75 },
      { month: 'May', battery: 90, functional: 92, physical: 88 },
      { month: 'Jun', battery: 95, functional: 96, physical: 94 },
      { month: 'Jul', battery: 98, functional: 97, physical: 96 },
      { month: 'Aug', battery: 100, functional: 99, physical: 98 },
      { month: 'Sep', battery: 102, functional: 101, physical: 100 },
      { month: 'Oct', battery: 105, functional: 104, physical: 103 },
      { month: 'Nov', battery: 108, functional: 107, physical: 106 },
      { month: 'Dec', battery: 110, functional: 109, physical: 108 }
    ];

    switch(timeRange) {
      case '3month':
        return allTrendData.slice(-3);
      case '6month':
        return allTrendData.slice(-6);
      case '1year':
        return allTrendData;
      case 'all':
      default:
        return allTrendData;
    }
  }, [timeRange]);

  // Radar chart data for maintenance quality
  const radarData = [
    { maintenance: 'Battery', score: 85, fullMark: 100 },
    { maintenance: 'Functional', score: 92, fullMark: 100 },
    { maintenance: 'Physical', score: 78, fullMark: 100 },
  ];

  const handleChartClick = (data, index) => {
    setSelectedMaintenanceType(recentMonthChartData[index].type);
  };

  const getDetailedData = () => {
    if (!selectedMaintenanceType) return [];
    
    let data = selectedMaintenanceType === 'battery' 
      ? sampleData.batteryMaintenance 
      : selectedMaintenanceType === 'functional'
      ? sampleData.functionalTest
      : sampleData.physicalInspection;

    // Apply filters
    if (searchTerm) {
      data = data.filter(item => 
        item.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      data = data.filter(item => item.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    return data;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'Needs Attention': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'Pending': return <Clock className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Needs Attention': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Pending': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-2xl">
          <p className="text-slate-200 font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
          {/* Maintenance Status Chart (Recent Month - Pending vs Completed) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Current Month Status</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <Activity className="h-4 w-4" />
                <span>Current Month</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={recentMonthChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  onClick={handleChartClick}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="completed" fill="#00F5A0" name="Completed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#FF6B6B" name="Pending" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Completion Rate Radar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Maintenance Quality</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <TrendingUp className="h-4 w-4" />
                <span>Quality Score</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="maintenance" stroke="#64748b" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" />
                  <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Trends */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Maintenance Trends */}
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
                  data={filteredTrendData}
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

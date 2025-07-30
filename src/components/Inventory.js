import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Inventory() {
  const router = useRouter();
  const [jammerData, setJammerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "serial_number", direction: "asc" });

  useEffect(() => {
    async function fetchJammerData() {
      try {
        const response = await fetch(`/api/rifle-jammers`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setLocations([...new Set(data.map((jammer) => jammer.location_name))]);
        setJammerData(data);
        setFilteredData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJammerData();
  }, []);

  useEffect(() => {
    let filtered = jammerData;
    if (selectedLocation) {
      filtered = filtered.filter(jammer => jammer.location_name === selectedLocation);
    }
    if (selectedStatus !== "") {
      filtered = filtered.filter(jammer => jammer.client_status === (selectedStatus === "Available" ? "0" : "1"));
    }
    setFilteredData(filtered);
  }, [selectedLocation, selectedStatus, jammerData]);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    setFilteredData([...filteredData].sort((a, b) => {
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      return 0;
    }));
  };

  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      text: "text-blue-600",
      title: "text-blue-900"
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      text: "text-green-600",
      title: "text-green-900"
    },
    red: {
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      text: "text-red-600",
      title: "text-red-900"
    }
  };

  const statCards = [
    { label: "Total Jammers", count: jammerData.length, color: "blue" },
    { label: "Available", count: jammerData.filter(j => j.client_status === "0").length, color: "green" },
    { label: "Under Service", count: jammerData.filter(j => j.client_status === "1").length, color: "red" }
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500 text-lg font-medium bg-red-50 px-6 py-4 rounded-lg">Error: {error}</div>
    </div>
  );

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Rifle Jammers</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map(({ label, count, color }) => (
          <div key={label} className={`${colorClasses[color].bg} rounded-xl p-6 flex flex-col shadow-sm`}>
            <span className={`${colorClasses[color].text} text-sm font-medium`}>{label}</span>
            <span className={`text-3xl font-bold ${colorClasses[color].title} mt-2`}>{count}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {[
          {
            label: "All Locations",
            value: selectedLocation,
            onChange: setSelectedLocation,
            options: locations
          },
          {
            label: "All Status",
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: ["Available", "Under Service"]
          }
        ].map(({ label, value, onChange, options }, i) => (
          <select
            key={i}
            className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">{label}</option>
            {options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {["serial_number", "type", "location_name"].map((key) => (
                <th
                  key={key}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center gap-2">
                    {key.replace("_", " ").toUpperCase()}
                    {sortConfig.key === key && (
                      <span className="text-blue-500">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((jammer, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <Link
                    href={`/${router.query.username}/jammer/${encodeURIComponent(jammer.serial_number)}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {jammer.serial_number}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-700">{jammer.type} [RF,GPS]</td>
                <td className="px-6 py-4 text-gray-700">{jammer.location_name}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      jammer.client_status === "0"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {jammer.client_status === "0" ? "Available" : "Under Service"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

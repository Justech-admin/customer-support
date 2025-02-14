import Link from "next/link";
import { useEffect, useState } from "react";

export default function Inventory() {
  const [jammerData, setJammerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "serial_number",
    direction: "asc",
  });

  useEffect(() => {
    async function fetchJammerData() {
      try {
        const response = await fetch(`/api/rifle-jammers`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        const uniqueLocations = [
          ...new Set(data.map((jammer) => jammer.location_name)),
        ];
        setLocations(uniqueLocations);

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
      filtered = filtered.filter(
        (jammer) => jammer.location_name === selectedLocation
      );
    }
    if (selectedStatus !== "") {
      const statusValue = selectedStatus === "Available" ? 0 : 1;
      filtered = filtered.filter((jammer) => jammer.status === statusValue);
    }
    setFilteredData(filtered);
  }, [selectedLocation, selectedStatus, jammerData]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setFilteredData(sortedData);
  };

  const totalJammers = jammerData.length;
  const availableJammers = jammerData.filter((j) => j.status === 0).length;
  const underServiceJammers = jammerData.filter((j) => j.status === 1).length;

  if (loading) return <p className="text-gray-600 text-lg">Loading data...</p>;
  if (error) return <p className="text-red-500 text-lg">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Rifle Jammers</h2>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-100 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Jammers</h3>
            <p className="text-2xl font-bold text-blue-700">{totalJammers}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-700">Available</h3>
            <p className="text-2xl font-bold text-green-700">{availableJammers}</p>
          </div>
          <div className="p-4 bg-red-100 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-700">Under Service</h3>
            <p className="text-2xl font-bold text-red-700">{underServiceJammers}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            className="p-2 border rounded-lg"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded-lg"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Under Service">Under Service</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th
                  className="py-3 px-6 border-b text-left cursor-pointer"
                  onClick={() => handleSort("serial_number")}
                >
                  Serial Number{" "}
                  {sortConfig.key === "serial_number"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th className="py-3 px-6 border-b text-left">Type</th>
                <th
                  className="py-3 px-6 border-b text-left cursor-pointer"
                  onClick={() => handleSort("location_name")}
                >
                  Location{" "}
                  {sortConfig.key === "location_name"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th
                  className="py-3 px-6 border-b text-left cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortConfig.key === "status"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((jammer, index) => (
                <tr key={index} className="hover:bg-gray-100 transition">
                  <td className="py-2 px-6 border-b">
                    <Link
                      href={`/INS_ANGRE/jammer/${encodeURIComponent(
                        jammer.serial_number
                      )}`}
                      className="text-blue-600 hover:underline"
                    >
                      {jammer.serial_number}
                    </Link>
                  </td>
                  <td className="py-2 px-6 border-b">{jammer.type} Band</td>
                  <td className="py-2 px-6 border-b">{jammer.location_name}</td>
                  <td className="py-2 px-6 border-b text-center">
                    <span
                      className="inline-flex items-center justify-center px-5 py-1 rounded-md text-sm font-semibold"
                      style={{
                        backgroundColor:
                          jammer.status === 0 ? "#BBF7D0" : "#FECACA",
                        color: jammer.status === 0 ? "#065F46" : "#991B1B",
                        minWidth: "100px",
                      }}
                    >
                      {jammer.status === 0 ? "Available" : "Under Service"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

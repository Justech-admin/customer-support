import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";

const JammerPreview = () => {
  const router = useRouter();
  const { username, serialNum } = router.query;
  const [collapsed, setCollapsed] = useState(false);
  const [jammerData, setJammerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!serialNum) return;

    const fetchJammerData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/rifle-jammers?serial_number=${serialNum}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data.length === 0) {
          throw new Error("Jammer not found");
        }
        setJammerData(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJammerData();
  }, [serialNum]);

  // Function to format dates as dd/mm/yy
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculate warranty remaining days
  const calculateWarrantyDays = () => {
    if (!jammerData?.delivery_date) return "N/A";
    const deliveryDate = new Date(jammerData.delivery_date);
    const warrantyEnd = new Date(
      deliveryDate.setFullYear(deliveryDate.getFullYear() + 2)
    );
    const today = new Date();
    const diffTime = warrantyEnd - today;
    return diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gray-50 p-6 overflow-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push(`/${username}/Inventory`)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Back to Inventory
          </button>
        </div>

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Jammer Details
                </h1>
                <p className="text-gray-500">
                  Serial Number: {jammerData.serial_number}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  jammerData.status === 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {jammerData.status === 0 ? "Available" : "Under Service"}
              </span>
            </div>
          </div>

          {/* Image and Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src="../../img/rifleJammer.png"
                  alt="Jammer"
                  className="rounded-lg w-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Main Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-600">Type:</p>
                    <p className="font-medium">{jammerData.type}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600">Frequency Range:</p>
                    <p className="font-medium">
                      {jammerData.frequencies || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600">Manufacturing Date:</p>
                    <p className="font-medium">
                      {formatDate(jammerData.manufacturing_date)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600">Delivery Date:</p>
                    <p className="font-medium">
                      {formatDate(jammerData.delivery_date)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-semibold">Warranty Status</p>
                  <p className="text-blue-600">
                    {calculateWarrantyDays()} days remaining
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Maintenance Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Last Maintenance</p>
                <p className="font-medium">
                  {formatDate(jammerData.last_maintenance)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Next Maintenance</p>
                <p className="font-medium text-red-600">
                  {formatDate(jammerData.next_maintenance)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JammerPreview;

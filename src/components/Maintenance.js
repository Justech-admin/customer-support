import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Search,
  Filter,
} from "lucide-react";
import { useRouter } from "next/router";

const MaintenanceTracker = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formTypeFilter, setFormTypeFilter] = useState("all");

  const getNextMaintenanceDate = () => {
    const today = new Date();
    let nextDate = new Date(today.getFullYear(), today.getMonth(), 7);

    // If today is after the 7th, schedule for next month
    if (today.getDate() > 7) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    return nextDate.toISOString().split("T")[0];
  };

  const calculateMaintenanceStatus = (lastDate) => {
    const today = new Date();
    const currentDay = today.getDate();

    // Always calculate next maintenance date as 7th of current/next month
    let nextMaintenanceDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      7
    );
    if (currentDay > 7) {
      nextMaintenanceDate.setMonth(nextMaintenanceDate.getMonth() + 1);
    }

    // If maintenance was done this month
    if (lastDate) {
      const lastMaintenanceDate = new Date(lastDate);
      if (
        lastMaintenanceDate.getMonth() === today.getMonth() &&
        lastMaintenanceDate.getFullYear() === today.getFullYear()
      ) {
        if (currentDay <= 25) {
          return "completed";
        }
        // After 25th, start showing next month's schedule
        return "in-progress"; // Shows as "Scheduled"
      }
    }

    // For scheduling next maintenance
    if (currentDay >= 1 && currentDay <= 7) {
      return "upcoming"; // Shows as "Due Soon"
    } else if (currentDay > 25) {
      return "in-progress"; // Shows as "Scheduled"
    } else {
      return currentDay > 7 ? "overdue" : "in-progress";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/maintenance");
        const data = await response.json();

        // Transform the API data
        const transformedData = data.map((item) => {
          const nextDueDate = getNextMaintenanceDate();

          return {
            name: item.serialNumber,
            serialNumber: item.serialNumber,
            locationName: item.locationName,
            maintenanceStatus: {
              functional: {
                status: calculateMaintenanceStatus(
                  item.functionalMaintenanceDate
                ),
                lastDate: item.functionalMaintenanceDate,
                nextDueDate: nextDueDate,
              },
              battery: {
                status: calculateMaintenanceStatus(item.batteryMaintenanceDate),
                lastDate: item.batteryMaintenanceDate,
                nextDueDate: nextDueDate,
              },
              physical: {
                status: calculateMaintenanceStatus(
                  item.physicalMaintenanceDate
                ),
                lastDate: item.physicalMaintenanceDate,
                nextDueDate: nextDueDate,
              },
            },
          };
        });

        setProducts(transformedData);
        setFilteredProducts(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.serialNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.locationName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (product) =>
          product.maintenanceStatus.functional.status === statusFilter ||
          product.maintenanceStatus.battery.status === statusFilter ||
          product.maintenanceStatus.physical.status === statusFilter
      );
    }

    if (formTypeFilter !== "all") {
      result = result.filter(
        (product) => product.maintenanceStatus[formTypeFilter].status !== "none"
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, statusFilter, formTypeFilter, products]);

  const getStatusIndicator = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="flex items-center text-green-600">
            <CheckCircle size={16} className="mr-1" /> Completed
          </span>
        );
      case "overdue":
        return (
          <span className="flex items-center text-red-600">
            <AlertTriangle size={16} className="mr-1" /> Overdue
          </span>
        );
      case "upcoming":
        return (
          <span className="flex items-center text-orange-500">
            <Clock size={16} className="mr-1" /> Due Soon
          </span>
        );
      case "in-progress":
        return (
          <span className="flex items-center text-blue-600">
            <Calendar size={16} className="mr-1" /> Scheduled
          </span>
        );
      case "none":
        return (
          <span className="flex items-center text-gray-400">Not Required</span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Maintenance Tracking Dashboard
      </h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search devices by serial number or location..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-3 py-2">
                <Filter size={18} className="text-gray-500" />
              </div>
              <select
                className="flex-1 px-2 py-2 focus:outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="upcoming">Due Soon</option>
                <option value="in-progress">Scheduled</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-64">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-3 py-2">
                <FileText size={18} className="text-gray-500" />
              </div>
              <select
                className="flex-1 px-2 py-2 focus:outline-none"
                value={formTypeFilter}
                onChange={(e) => setFormTypeFilter(e.target.value)}
              >
                <option value="all">All Form Types</option>
                <option value="functional">Functional Test</option>
                <option value="battery">Battery Maintenance</option>
                <option value="physical">Physical Inspection</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Device Info
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Functional Test
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Battery Maintenance
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Physical Inspection
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.serialNumber} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Serial No.: {product.serialNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.locationName}
                    </div>
                  </td>

                  {/* Functional Test Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="mb-1">
                      {getStatusIndicator(
                        product.maintenanceStatus.functional.status
                      )}
                    </div>
                    {product.maintenanceStatus.functional.status !== "none" && (
                      <>
                        <div className="text-xs text-gray-500">
                          Last:{" "}
                          {product.maintenanceStatus.functional.lastDate ||
                            "Never"}
                        </div>
                        <div className="text-xs font-medium">
                          Next:{" "}
                          {product.maintenanceStatus.functional.nextDueDate}
                        </div>
                      </>
                    )}
                  </td>

                  {/* Battery Maintenance Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="mb-1">
                      {getStatusIndicator(
                        product.maintenanceStatus.battery.status
                      )}
                    </div>
                    {product.maintenanceStatus.battery.status !== "none" && (
                      <>
                        <div className="text-xs text-gray-500">
                          Last:{" "}
                          {product.maintenanceStatus.battery.lastDate ||
                            "Never"}
                        </div>
                        <div className="text-xs font-medium">
                          Next: {product.maintenanceStatus.battery.nextDueDate}
                        </div>
                      </>
                    )}
                  </td>

                  {/* Physical Inspection Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="mb-1">
                      {getStatusIndicator(
                        product.maintenanceStatus.physical.status
                      )}
                    </div>
                    {product.maintenanceStatus.physical.status !== "none" && (
                      <>
                        <div className="text-xs text-gray-500">
                          Last:{" "}
                          {product.maintenanceStatus.physical.lastDate ||
                            "Never"}
                        </div>
                        <div className="text-xs font-medium">
                          Next: {product.maintenanceStatus.physical.nextDueDate}
                        </div>
                      </>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mb-2 block">
                      View Maintenance History
                    </button>
                    <div className="flex flex-col space-y-1">
                      <button
                        className="text-sm py-1 px-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                        onClick={() => {
                          const encodedSerialNumber = encodeURIComponent(
                            product.serialNumber
                          );
                          router.push(
                            `/${router.query.username}/Maintenance/functional/${encodedSerialNumber}`
                          );
                        }}
                      >
                        Perform Functional Test
                      </button>
                      <button className="text-sm py-1 px-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">
                        Perform Battery Maintenance
                      </button>
                      <button className="text-sm py-1 px-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">
                        Perform Physical Inspection
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No results found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceTracker;

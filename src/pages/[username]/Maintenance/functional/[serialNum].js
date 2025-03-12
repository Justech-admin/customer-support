import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import { withAuth } from "../../../../utils/withAuth";
import Image from "next/image";

const JammerPreview = ({ tokenName }) => {
  const router = useRouter();
  const { username, serialNum } = router.query;
  const [collapsed, setCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    maintenanceDate: "",
    jammerDetails: "",
    model: "",
    serialNumber: serialNum || "",
    checklistItems: {
      "1a": false,
      "1b": false,
      "2a": false,
      "2b": false,
    },
    comments: ""
  });

  useEffect(() => {
    if (!serialNum) return;
    // Set serial number in form data when it becomes available
    setFormData(prev => ({...prev, serialNumber: serialNum}));
  }, [serialNum]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (item) => {
    setFormData(prev => ({
      ...prev,
      checklistItems: {
        ...prev.checklistItems,
        [item]: !prev.checklistItems[item]
      }
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission - you can add your submission logic here
    console.log("Form submitted:", formData);
    // Maybe navigate or show a success message
  };

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-8 underline">MONTHLY FUNCTIONAL TEST FORM</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <label className="font-semibold w-36">Maintenance Date:</label>
                <input
                  type="date"
                  name="maintenanceDate"
                  value={formData.maintenanceDate}
                  onChange={handleInputChange}
                  className="flex-1 border rounded p-2"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="font-semibold w-36">Jammer Details:</label>
                <input
                  type="text"
                  name="jammerDetails"
                  value={formData.jammerDetails}
                  onChange={handleInputChange}
                  className="flex-1 border rounded p-2"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="font-semibold w-36">Model:</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="flex-1 border rounded p-2"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="font-semibold w-36">Serial Number:</label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  className="flex-1 border rounded p-2"
                  readOnly={!!serialNum}
                />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Functional Inspection Checklist:</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-center w-20">SR. NO.</th>
                    <th className="border p-3 text-center w-40">COMPONENT</th>
                    <th className="border p-3 text-center">CHECKLIST ITEM</th>
                    <th className="border p-3 text-center w-24">CHECK (✓)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-3 text-center">1.</td>
                    <td className="border p-3" rowSpan="2">Power On/Off:</td>
                    <td className="border p-3"></td>
                    <td className="border p-3"></td>
                  </tr>
                  <tr>
                    <td className="border p-3 text-center">a.</td>
                    <td className="border p-3">Device powers on and off correctly.</td>
                    <td className="border p-3 text-center">
                      <input
                        type="checkbox"
                        checked={formData.checklistItems["1a"]}
                        onChange={() => handleCheckboxChange("1a")}
                        className="h-5 w-5"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3 text-center">b.</td>
                    <td className="border p-3"></td>
                    <td className="border p-3">Power trigger button functions smoothly.</td>
                    <td className="border p-3 text-center">
                      <input
                        type="checkbox"
                        checked={formData.checklistItems["1b"]}
                        onChange={() => handleCheckboxChange("1b")}
                        className="h-5 w-5"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3 text-center">2.</td>
                    <td className="border p-3" rowSpan="2">Jamming Performance:</td>
                    <td className="border p-3"></td>
                    <td className="border p-3"></td>
                  </tr>
                  <tr>
                    <td className="border p-3 text-center">a.</td>
                    <td className="border p-3">Jamming function activates as expected.</td>
                    <td className="border p-3 text-center">
                      <input
                        type="checkbox"
                        checked={formData.checklistItems["2a"]}
                        onChange={() => handleCheckboxChange("2a")}
                        className="h-5 w-5"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3 text-center">b.</td>
                    <td className="border p-3"></td>
                    <td className="border p-3">Jamming range is consistent with specifications.</td>
                    <td className="border p-3 text-center">
                      <input
                        type="checkbox"
                        checked={formData.checklistItems["2b"]}
                        onChange={() => handleCheckboxChange("2b")}
                        className="h-5 w-5"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <label className="font-semibold block mb-2">Comments:</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                className="w-full border rounded p-2 h-24"
              ></textarea>
            </div>
            
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Add getServerSideProps with withAuth
export const getServerSideProps = withAuth();

export default JammerPreview;

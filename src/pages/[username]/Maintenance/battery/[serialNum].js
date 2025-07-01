import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import { withAuth } from "../../../../utils/withAuth";

const JammerBatteryMaintenance = ({ tokenName }) => {
  const router = useRouter();
  const { username, serialNum } = router.query;
  const [collapsed, setCollapsed] = useState(false);
  const [jammerData, setJammerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    maintenanceDate: new Date().toISOString().split('T')[0],
    jammerType: "",
    model: "",
    serialNumber: serialNum || "",
    location: "",
    checklistItems: {
      // Battery Condition
      "1a": false, // Battery box is free from visible damage or swelling
      "1b": false, // No leakage or corrosion around battery sliding terminals
      "1c": false, // Battery box is easily seated into its compartment
      
      // Charge Status and Display
      "2a": false, // Battery level is adequate
      "2b": false, // Charging connections are secure and undamaged
      "2c": false, // Charger functions properly and charges the battery effectively
      "2d": false, // Battery display is functioning correctly
      "2e": false, // Battery level indicators are accurate and clear
      "2f": false, // No unusual flickering or dimming on the display
    },
    comments: "",
    name: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (!serialNum) return;

    const fetchJammerData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/maintenance?serial_number=${serialNum}`,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        if (data.length === 0) {
          throw new Error("Jammer not found");
        }
        setJammerData(data[0]);
        
        // Set jammer details in form data
        setFormData(prev => ({
          ...prev,
          jammerType: data[0].type || "",
          location: data[0].locationName || "",
          serialNumber: serialNum,
          model: data[0].model || "",
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJammerData();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission - you can add your submission logic here
    console.log("Battery Maintenance Form submitted:", formData);
    
    // API call would go here
    // const saveData = async () => {
    //   try {
    //     const response = await fetch('/api/battery-maintenance', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(formData)
    //     });
    //     
    //     if (response.ok) {
    //       router.push(`/${username}/Maintenance`);
    //     }
    //   } catch (error) {
    //     console.error('Error submitting form:', error);
    //   }
    // };
    // 
    // saveData();
    
    // For now, just navigate back
    alert("Form submitted successfully!");
    router.push(`/${username}/Maintenance`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-center text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-h-screen bg-gray-50 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Monthly Battery Maintenance Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6 text-center underline">MONTHLY BATTERY MAINTENANCE FORM</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                
                <div className="flex items-center space-x-2">
                  <label className="font-semibold w-36">Serial Number:</label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={jammerData?.serialNumber || formData.serialNumber}
                    readOnly
                    className="flex-1 border rounded p-2 bg-gray-50"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="font-semibold w-36">Model:</label>
                  <input
                    type="text"
                    name="model"
                    value={jammerData?.serialNumber ? jammerData.serialNumber.slice(0, -4) : formData.serialNumber.slice(0, -4)}
                    readOnly
                    className="flex-1 border rounded p-2 bg-gray-50"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="font-semibold w-36">Jammer Type:</label>
                  <input
                    type="text"
                    name="jammerType"
                    value={jammerData?.jammerType || formData.jammerType}
                    readOnly
                    className="flex-1 border rounded p-2 bg-gray-50"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="font-semibold w-36">Location:</label>
                  <input
                    type="text"
                    name="location"
                    value={jammerData?.locationName || formData.location}
                    readOnly
                    className="flex-1 border rounded p-2 bg-gray-50"
                  />
                </div>
              </div>
              
              <h2 className="text-lg font-semibold mt-8 mb-4">Battery Maintenance Checklist:</h2>
              
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
                    {/* Battery Condition Section */}
                    <tr>
                      <td className="border p-3 text-center" rowSpan="3">1</td>
                      <td className="border p-3" rowSpan="3">Battery Condition:</td>
                      <td className="border p-3">Battery box is free from visible damage or swelling.</td>
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
                      <td className="border p-3">No leakage or corrosion around battery sliding terminals.</td>
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
                      <td className="border p-3">Battery box is easily seated into its compartment.</td>
                      <td className="border p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["1c"]}
                          onChange={() => handleCheckboxChange("1c")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>
                    
                    {/* Charge Status and Display Section */}
                    <tr>
                      <td className="border p-3 text-center" rowSpan="6">2</td>
                      <td className="border p-3" rowSpan="6">Charge Status and Display:</td>
                      <td className="border p-3">Battery level is adequate.</td>
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
                      <td className="border p-3">Charging connections are secure and undamaged.</td>
                      <td className="border p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["2b"]}
                          onChange={() => handleCheckboxChange("2b")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3">Charger functions properly and charges the battery effectively.</td>
                      <td className="border p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["2c"]}
                          onChange={() => handleCheckboxChange("2c")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3">Battery display is functioning correctly.</td>
                      <td className="border p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["2d"]}
                          onChange={() => handleCheckboxChange("2d")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3">Battery level indicators are accurate and clear.</td>
                      <td className="border p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["2e"]}
                          onChange={() => handleCheckboxChange("2e")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3">No unusual flickering or dimming on the display.</td>
                      <td className="border p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["2f"]}
                          onChange={() => handleCheckboxChange("2f")}
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
              
              {/* Name and Designation fields */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <label className="font-semibold w-36">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="flex-1 border rounded p-2"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="font-semibold w-36">Designation:</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="flex-1 border rounded p-2"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push(`/${username}/Inventory`)}
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
    </div>
  );
};

// Add getServerSideProps with withAuth
export const getServerSideProps = withAuth();

export default JammerBatteryMaintenance;

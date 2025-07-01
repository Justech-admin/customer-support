import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import { withAuth } from "../../../../utils/withAuth";

const JammerPreview = ({ tokenName }) => {
  const router = useRouter();
  const { username, serialNum } = router.query;
  const [collapsed, setCollapsed] = useState(false);
  const [jammerData, setJammerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    inspectionDate: "",
    jammerDetails: "",
    model: "",
    serialNumber: serialNum || "",
    checklistItems: {
      "1a": false,
      "1b": false,
      "1c": false,
      "1d": false,
      "2a": false,
      "2b": false,
      "2c": false,
      "3a": false,
      "3b": false,
      "3c": false,
      "3d": false,
    },
    comments: "",
    signature: "",
    name: "",
    date: ""
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
          jammerDetails: data[0].type || "",
          serialNumber: serialNum
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
    console.log("Form submitted:", formData);
    // Maybe navigate or show a success message
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
              {/* Monthly Functional Test Form */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 text-center underline">MONTHLY PHYSICAL TEST FORM</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Header Fields */}
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
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Physical Condition Checklist:</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-center w-16">SR. NO.</th>
                      <th className="border border-gray-300 p-3 text-center w-32">COMPONENT</th>
                      <th className="border border-gray-300 p-3 text-center">CHECKLIST ITEM</th>
                      <th className="border border-gray-300 p-3 text-center w-20">CHECK (✓)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Jammer Section */}
                    <tr>
                      <td className="border border-gray-300 p-3 text-center font-semibold" rowSpan="4">1.</td>
                      <td className="border border-gray-300 p-3 font-semibold" rowSpan="4">Jammer:</td>
                      <td className="border border-gray-300 p-3">No visible cracks or damage.</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["1a"]}
                          onChange={() => handleCheckboxChange("1a")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Surface is clean and free of grime or dirt.</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["1b"]}
                          onChange={() => handleCheckboxChange("1b")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">No corrosion or damage to battery contacts.</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["1c"]}
                          onChange={() => handleCheckboxChange("1c")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">All buttons and switches are intact and function smoothly.</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["1d"]}
                          onChange={() => handleCheckboxChange("1d")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>
                    
                    {/* Strap Section */}
                    <tr>
                      <td className="border border-gray-300 p-3 text-center font-semibold" rowSpan="3">2.</td>
                      <td className="border border-gray-300 p-3 font-semibold" rowSpan="3">Strap:</td>
                      <td className="border border-gray-300 p-3">Strap is intact and securely attached.</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["2a"]}
                          onChange={() => handleCheckboxChange("2a")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">No fraying or visible wear.</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["2b"]}
                          onChange={() => handleCheckboxChange("2b")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Attachment Points are secure and undamaged.</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["2c"]}
                          onChange={() => handleCheckboxChange("2c")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>

                    {/* Bag Section */}
                    <tr>
                      <td className="border border-gray-300 p-3 text-center font-semibold" rowSpan="4">3.</td>
                      <td className="border border-gray-300 p-3 font-semibold" rowSpan="4">Bag:</td>
                      <td className="border border-gray-300 p-3">Free of visible damage or tearing.</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["3a"]}
                          onChange={() => handleCheckboxChange("3a")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Zippers and Fasteners are functioning properly.</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["3b"]}
                          onChange={() => handleCheckboxChange("3b")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Interior is clean and free of debris.</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["3c"]}
                          onChange={() => handleCheckboxChange("3c")}
                          className="h-5 w-5"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Compartments and Pockets are intact and functional.</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <input
                          type="checkbox"
                          checked={formData.checklistItems["3d"]}
                          onChange={() => handleCheckboxChange("3d")}
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
                  className="w-full border rounded p-3 h-32 resize-none"
                  placeholder="Enter any additional comments here..."
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
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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

export default JammerPreview;

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
      "1a": false,
      "1b": false,
      "1c": false,
      "2a": false,
      "2b": false,
      "2c": false,
      "2d": false,
      "2e": false,
      "2f": false,
    },
    comments: "",
    name: "",
    designation: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (!serialNum) return;

    const fetchJammerData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/maintenance?serial_number=${serialNum}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        if (data.length === 0) throw new Error("Jammer not found");

        setJammerData(data[0]);

        // Update form data with fetched values
        setFormData(prev => ({
          ...prev,
          jammerType: data[0].jammerType || "",
          location: data[0].locationName || "",
          serialNumber: serialNum,
          model: data[0].model || (serialNum ? serialNum.slice(0, -4) : ""),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Form submitted successfully!");
        router.push(`/${username}/Maintenance`);
      } else {
        const errorData = await response.json();
        console.error("Submission error:", errorData);
        alert(`Error: ${errorData.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting the form.');
    }
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
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6 text-center underline">
              MONTHLY BATTERY MAINTENANCE FORM
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Serial Number" value={formData.serialNumber} readOnly />
                <InputField label="Model" value={formData.model} readOnly />
                <InputField label="Jammer Type" value={formData.jammerType} readOnly />
                <InputField label="Location" value={formData.location} readOnly />
              </div>

              <h2 className="text-lg font-semibold mt-8 mb-4">Battery Maintenance Checklist:</h2>

              <BatteryChecklist checklistItems={formData.checklistItems} onChange={handleCheckboxChange} />

              <div className="mt-6">
                <label className="font-semibold block mb-2">Comments:</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 h-24"
                ></textarea>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField name="name" label="Name" value={formData.name} onChange={handleInputChange} />
                <InputField name="designation" label="Designation" value={formData.designation} onChange={handleInputChange} />
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

const InputField = ({ name, label, value, onChange, readOnly = false }) => (
  <div className="flex items-center space-x-2">
    <label className="font-semibold w-36">{label}:</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className="flex-1 border rounded p-2 bg-gray-50"
    />
  </div>
);

const BatteryChecklist = ({ checklistItems, onChange }) => {
  const checklist = [
    {
      section: "Battery Condition",
      rows: [
        ["1a", "Battery box is free from visible damage or swelling."],
        ["1b", "No leakage or corrosion around battery sliding terminals."],
        ["1c", "Battery box is easily seated into its compartment."]
      ]
    },
    {
      section: "Charge Status and Display",
      rows: [
        ["2a", "Battery level is adequate."],
        ["2b", "Charging connections are secure and undamaged."],
        ["2c", "Charger functions properly and charges the battery effectively."],
        ["2d", "Battery display is functioning correctly."],
        ["2e", "Battery level indicators are accurate and clear."],
        ["2f", "No unusual flickering or dimming on the display."]
      ]
    }
  ];

  let index = 1;
  return (
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
          {checklist.map((section, i) => (
            section.rows.map((row, j) => (
              <tr key={row[0]}>
                {j === 0 && (
                  <td className="border p-3 text-center" rowSpan={section.rows.length}>{index++}</td>
                )}
                {j === 0 && (
                  <td className="border p-3" rowSpan={section.rows.length}>{section.section}:</td>
                )}
                <td className="border p-3">{row[1]}</td>
                <td className="border p-3 text-center">
                  <input
                    type="checkbox"
                    checked={checklistItems[row[0]]}
                    onChange={() => onChange(row[0])}
                    className="h-5 w-5"
                  />
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const getServerSideProps = withAuth();

export default JammerBatteryMaintenance;

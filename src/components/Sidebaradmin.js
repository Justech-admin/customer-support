import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiBox, FiFileText, FiClipboard,  } from "react-icons/fi";
import { FiHome, FiUsers, FiPackage, FiMail, FiTool,FiMenu, FiLogOut, FiX } from "react-icons/fi";
export default function Sidebar() {
  const router = useRouter();
  const { username } = router.query;
  
  // Read initial state from localStorage
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("sidebarCollapsed")) || false;
    }
    return false;
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Update localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    // Clear authentication data
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      // Clear any other auth-related items you might have
    }
    
    // Redirect to login page
    router.push("/login");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };



const tabs = [
  { id: "AdminDashboard", name: "Dashboard", icon: <FiHome size={20} /> },
  { id: "Products", name: "Products", icon: <FiPackage size={20} /> },
  { id: "Tickets_admin", name: "Tickets", icon: <FiFileText size={20} /> },
  { id: "Maintenance_admin", name: "Maintenance", icon: <FiTool size={20} /> },
  { id: "users", name: "Users", icon: <FiUsers size={20} /> },

];

  return (
    <div
      className={`bg-gray-900 text-white h-screen transition-all duration-300 ease-in-out shadow-lg flex flex-col ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h2 className="text-2xl font-bold">JUS Portal</h2>}
        <button onClick={toggleSidebar} className="text-white p-2 rounded-md">
          <FiMenu size={24} />
        </button>
      </div>

      {/* Sidebar Items */}
      <ul className="space-y-2 p-2 flex-1">
        {tabs.map((tab) => {
          const isActive = router.pathname.includes(tab.id);
          return (
            <li
              key={tab.id}
              className={`flex items-center rounded-lg transition-all duration-300 ease-in-out ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              <Link href={`/admin/${tab.id}`} className="w-full flex items-center p-3">
                <div className="flex items-center justify-center w-12">{tab.icon}</div>
                {!collapsed && <span className="text-lg">{tab.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Logout Button */}
      <div className="p-2 border-t border-gray-700">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center p-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-red-600 text-red-400 hover:text-white"
        >
          <div className="flex items-center justify-center w-12">
            <FiLogOut size={20} />
          </div>
          {!collapsed && <span className="text-lg">Logout</span>}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
              <button
                onClick={handleLogoutCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleLogoutCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

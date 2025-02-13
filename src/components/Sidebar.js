import Link from "next/link";
import { useRouter } from "next/router";
import { FiBox, FiFileText, FiTool, FiClipboard, FiMenu } from "react-icons/fi";

export default function Sidebar({ collapsed, setCollapsed }) {
  const router = useRouter();
  const { username } = router.query;

  const tabs = [
    { id: "Inventory", name: "Inventory", icon: <FiBox size={20} /> },
    { id: "TicketIssue", name: "Ticket Issue", icon: <FiFileText size={20} /> },
    { id: "Tickets", name: "Tickets", icon: <FiClipboard size={20} /> },
    { id: "Maintenance", name: "Maintenance", icon: <FiTool size={20} /> },
  ];

  return (
    <div
      className={`bg-gray-900 text-white h-screen transition-all duration-300 ease-in-out shadow-lg ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h2 className="text-2xl font-bold">Dashboard</h2>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-white p-2 rounded-md">
          <FiMenu size={24} />
        </button>
      </div>

      {/* Sidebar Items */}
      <ul className="space-y-2 p-2">
        {tabs.map((tab) => {
          const isActive = router.pathname.includes(tab.id); // Checks if the tab is active
          return (
            <li
              key={tab.id}
              className={`flex items-center rounded-lg transition-all duration-300 ease-in-out ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              <Link href={`/${username}/${tab.id}`} className="w-full flex items-center p-3">
                <div className="flex items-center justify-center w-12">{tab.icon}</div>
                {!collapsed && <span className="text-lg">{tab.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

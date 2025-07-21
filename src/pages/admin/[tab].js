"use client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { withAuth } from "../../utils/withAuth";

// Dynamic imports with loading states
const AdminDashboard = dynamic(() => import("../../components/AdminDashboard"), {
  loading: () => <div className="animate-pulse p-4">Loading dashboard...</div>
});

const Customers = dynamic(() => import("../../components/Customers"), {
  loading: () => <div className="animate-pulse p-4">Loading customers...</div>
});

const Products = dynamic(() => import("../../components/Products"), {
  loading: () => <div className="animate-pulse p-4">Loading Products...</div>
});

const Tickets_admin = dynamic(() => import("../../components/Tickets_admin"), {
  loading: () => <div className="animate-pulse p-4">Loading Tickets...</div>
});

const EmailSystem = dynamic(() => import("../../components/EmailSystem"), {
  loading: () => <div className="animate-pulse p-4">Loading Emails...</div>
});

const Maintenance_admin = dynamic(() => import("../../components/Maintenance_admin"), {
  loading: () => <div className="animate-pulse p-4">Loading Maintenance details...</div>
});



const Sidebaradmin = dynamic(() => import("../../components/Sidebaradmin"), {
  ssr: false
});

function AdminTab({ tokenName }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState(null);

  // Wait for client render
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle auth and tab routing
  useEffect(() => {
    if (!router.isReady) return;

    const { tab } = router.query;

    if (!tokenName) {
        router.push("/login");
        return;
    }


    setCurrentTab(tab);
  }, [router.isReady, router.query, tokenName]);

  if (!isClient) return null;

  const renderComponent = () => {
    switch (currentTab) {
      case "AdminDashboard":
        return <AdminDashboard />;
      case "Customers":
        return <Customers />;
      case "Products":
        return <Products />;
      case "Tickets_admin":
        return <Tickets_admin />;
      case "EmailSystem":
        return <EmailSystem />;
      case "Maintenance_admin":
        return <Maintenance_admin />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500 text-lg font-medium">Page Not Found</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-none">
        <Sidebaradmin
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          currentTab={currentTab}
          userType="admin" // Optional: you can pass this to customize sidebar
        />
      </div>
      <main
        className={`flex-1 transition-all duration-300 overflow-auto ${
          collapsed ? "ml-6" : "ml-6"
        }`}
      >
        <div className="p-8 max-w-7xl mx-auto">{renderComponent()}</div>
      </main>
    </div>
  );
}

export const getServerSideProps = withAuth();

export default AdminTab;

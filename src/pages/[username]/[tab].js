"use client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { withAuth } from "../../utils/withAuth";

// Dynamically import components with loading states
const Inventory = dynamic(() => import("../../components/Inventory"), {
  loading: () => <div className="animate-pulse p-4">Loading inventory...</div>
});

const TicketIssue = dynamic(() => import("../../components/TicketIssue"), {
  loading: () => <div className="animate-pulse p-4">Loading ticket form...</div>
});

const Tickets = dynamic(() => import("../../components/TIcketStatus"), {
  loading: () => <div className="animate-pulse p-4">Loading tickets...</div>
});

const Maintenance = dynamic(() => import("../../components/Maintenance"), {
  loading: () => <div className="animate-pulse p-4">Loading maintenance...</div>
});

const Sidebar = dynamic(() => import("../../components/Sidebar"), {
  ssr: false
});

function UserTab({ tokenName }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState(null);
  
  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle authentication and routing
  useEffect(() => {
    if (!router.isReady) return;

    const { tab, username } = router.query;
    
    
    if (!tokenName || tokenName !== username) {
      router.push("/login");
      return;
    }

    setCurrentTab(tab);
  }, [tokenName, router.isReady, router.query, router]);

  // Don't render anything until we're on the client
  if (!isClient) {
    return null;
  }

  const renderComponent = () => {
    switch (currentTab) {
      case "Inventory":
        return <Inventory />;
      case "TicketIssue":
        return <TicketIssue />;
      case "Tickets":
        return <Tickets />;
      case "Maintenance":
        return <Maintenance />;
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
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed}
          currentTab={currentTab}
        />
      </div>
      <main 
        className={`flex-1 transition-all duration-300 overflow-auto ${
          collapsed ? 'ml-6' : 'ml-6'
        }`}
      >
        <div className="p-8 max-w-7xl mx-auto">
          {renderComponent()}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = withAuth();

export default UserTab;

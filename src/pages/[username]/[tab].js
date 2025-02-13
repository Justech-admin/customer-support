import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Inventory from '../../components/Inventory';
import TicketIssue from '../../components/TicketIssue';
import Tickets from '../../components/TIcketStatus';
import Maintenance from '../../components/Maintenance';
import Sidebar from '../../components/Sidebar';
import { useState, useEffect } from 'react';

export default function UserTab() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const { tab } = router.query;
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const renderComponent = () => {
    switch (tab) {
      case 'Inventory':
        return <Inventory />;
      case 'TicketIssue':
        return <TicketIssue />;
      case 'Tickets':
        return <Tickets />;
      case 'Maintenance':
        return <Maintenance />;
      default:
        return <p className="text-red-500">Page Not Found</p>;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 p-8 overflow-auto">{renderComponent()}</div>
    </div>
  );
}

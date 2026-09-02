// components/admin/Sidebar.tsx
import Link from 'next/link';

export const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Inventory Health', href: '/admin/inventory/health' },
    { name: 'Vendor Approvals', href: '/admin/vendors' },
    { name: 'User Management', href: '/admin/users' },
      { name: 'Financials', href: '/admin/financials' },
      { name: 'Bookings& Payment', href: '/admin/bookings' },
  ];

  return (
    <nav className="p-4">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link 
              href={item.href}
              className="block p-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
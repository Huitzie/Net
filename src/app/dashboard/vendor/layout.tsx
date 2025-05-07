
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendor Dashboard | Venue Vendors',
  description: 'Manage your vendor profile, services, and bookings.',
};

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

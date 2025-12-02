'use client';

import { useState, useEffect } from 'react';
import { menuAPI, ordersAPI, reservationsAPI } from '@/lib/api';
import { Package, Calendar, UtensilsCrossed, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalReservations: 0,
    menuItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, reservationsRes, menuRes] = await Promise.all([
        ordersAPI.getAll(),
        reservationsAPI.getAll(),
        menuAPI.getAll()
      ]);

      const orders = ordersRes.data.orders || [];
      const pendingOrders = orders.filter(o => o.status === 'pending').length;

      setStats({
        totalOrders: orders.length,
        pendingOrders,
        totalReservations: reservationsRes.data.reservations?.length || 0,
        menuItems: menuRes.data.items?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<Package className="w-8 h-8" />}
            title="Total Orders"
            value={stats.totalOrders}
            color="bg-blue-500"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Pending Orders"
            value={stats.pendingOrders}
            color="bg-yellow-500"
          />
          <StatCard
            icon={<Calendar className="w-8 h-8" />}
            title="Reservations"
            value={stats.totalReservations}
            color="bg-green-500"
          />
          <StatCard
            icon={<UtensilsCrossed className="w-8 h-8" />}
            title="Menu Items"
            value={stats.menuItems}
            color="bg-purple-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Manage Orders"
            description="View and update order status"
            link="/admin/orders"
            icon={<Package className="w-12 h-12" />}
          />
          <ActionCard
            title="Manage Reservations"
            description="View and manage table reservations"
            link="/admin/reservations"
            icon={<Calendar className="w-12 h-12" />}
          />
          <ActionCard
            title="Manage Menu"
            description="Add, edit, or remove menu items"
            link="/admin/menu"
            icon={<UtensilsCrossed className="w-12 h-12" />}
          />
        </div>

        {/* Note */}
        <div className="mt-12 card bg-yellow-50 border border-yellow-200">
          <h3 className="text-lg font-bold mb-2">🔨 Under Development</h3>
          <p className="text-gray-700">
            The admin management interfaces are ready to be built. You can extend this dashboard
            by creating pages in <code className="bg-gray-200 px-2 py-1 rounded">app/admin/orders</code>,
            <code className="bg-gray-200 px-2 py-1 rounded ml-1">app/admin/reservations</code>, and
            <code className="bg-gray-200 px-2 py-1 rounded ml-1">app/admin/menu</code>.
          </p>
          <p className="text-gray-700 mt-2">
            The API is fully functional - you can manage everything via API calls for now!
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, description, link, icon }) {
  return (
    <div className="card hover:shadow-xl transition-shadow cursor-pointer">
      <div className="text-primary-600 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="text-primary-600 font-semibold">
        Coming soon →
      </div>
    </div>
  );
}

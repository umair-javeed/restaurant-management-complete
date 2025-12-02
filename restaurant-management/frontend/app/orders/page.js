'use client';

import { useState, useEffect } from 'react';
import { ordersAPI } from '@/lib/api';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerPhone, setCustomerPhone] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchByPhone = async () => {
    if (!customerPhone) {
      fetchOrders();
      return;
    }
    try {
      setLoading(true);
      const response = await ordersAPI.getByCustomer(customerPhone);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error searching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'preparing': 'bg-purple-100 text-purple-800',
      'ready': 'bg-green-100 text-green-800',
      'out-for-delivery': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-200 text-green-900',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': <Clock className="w-5 h-5" />,
      'delivered': <CheckCircle className="w-5 h-5" />,
      'cancelled': <XCircle className="w-5 h-5" />,
    };
    return icons[status] || <Package className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Track Your Orders</h1>
          <div className="flex gap-4">
            <input
              type="tel"
              placeholder="Enter phone number to search"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button onClick={searchByPhone} className="btn-primary">
              Search
            </button>
            <button onClick={() => { setCustomerPhone(''); fetchOrders(); }} className="btn-secondary">
              Clear
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Order #{order.orderNumber}</h3>
                    <p className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.replace('-', ' ').toUpperCase()}
                  </div>
                </div>

                <div className="border-t border-b py-4 mb-4">
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <p className="text-gray-700">{order.customerName}</p>
                  <p className="text-gray-600">{order.customerPhone}</p>
                  {order.customerEmail && <p className="text-gray-600">{order.customerEmail}</p>}
                  {order.deliveryAddress && (
                    <p className="text-gray-600 mt-2">
                      <strong>Delivery:</strong> {order.deliveryAddress}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-primary-600">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {order.specialInstructions && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded">
                    <p className="text-sm"><strong>Special Instructions:</strong> {order.specialInstructions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

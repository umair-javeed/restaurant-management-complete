import Link from 'next/link'
import { UtensilsCrossed, CalendarCheck, ShoppingCart, LayoutDashboard } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Our Restaurant
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Order online, make reservations, and enjoy delicious food
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/menu" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                View Menu
              </Link>
              <Link href="/reservations" className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-900 transition-colors border-2 border-white">
                Make Reservation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<UtensilsCrossed className="w-12 h-12" />}
            title="Browse Menu"
            description="Explore our delicious menu items and add them to your cart"
            link="/menu"
          />
          <FeatureCard
            icon={<ShoppingCart className="w-12 h-12" />}
            title="Place Orders"
            description="Order online for delivery or pickup"
            link="/menu"
          />
          <FeatureCard
            icon={<CalendarCheck className="w-12 h-12" />}
            title="Make Reservations"
            description="Book a table for your special occasion"
            link="/reservations"
          />
          <FeatureCard
            icon={<LayoutDashboard className="w-12 h-12" />}
            title="Admin Dashboard"
            description="Manage orders, menu, and reservations"
            link="/admin"
          />
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We serve the finest cuisine with fresh ingredients and authentic flavors. 
              Our restaurant management system makes it easy to order online or reserve a table.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, link }) {
  return (
    <Link href={link} className="card hover:shadow-xl transition-shadow duration-200">
      <div className="text-primary-600 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  )
}

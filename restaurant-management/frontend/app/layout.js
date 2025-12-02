import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Restaurant Management System',
  description: 'Online ordering and reservation system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/" className="flex-shrink-0 flex items-center">
                  <span className="text-2xl font-bold text-primary-600">Restaurant</span>
                </Link>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link href="/menu" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-primary-600">
                    Menu
                  </Link>
                  <Link href="/orders" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-primary-600">
                    Orders
                  </Link>
                  <Link href="/reservations" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-primary-600">
                    Reservations
                  </Link>
                  <Link href="/admin" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-primary-600">
                    Admin
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white mt-12">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <p className="text-center">&copy; 2024 Restaurant Management System. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

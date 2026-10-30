import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminTopbar from '../components/admin/AdminTopbar'
import '../styles/admin/AdminLayout.css'

export default function AdminLayout() {
  return (
    <div className="admin-app-shell">
      <AdminSidebar />
      <main className="admin-main-content">
        <AdminTopbar />
        <div className="admin-route-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

import { Outlet } from 'react-router-dom'
import { PublicNavbar } from './PublicNavbar'
import { PublicFooter } from './PublicFooter'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}

'use client'

import Sidebar from '@/components/dashboard/Sidebar'
import MobileNav from '@/components/dashboard/MobileNav'

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg text-apex-text selection:bg-apex-accent selection:text-bg">
      <Sidebar />
      <main className="flex-1 md:ml-60 p-5 md:p-8 min-h-screen overflow-y-auto mt-14 md:mt-0 pb-24 md:pb-8">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}

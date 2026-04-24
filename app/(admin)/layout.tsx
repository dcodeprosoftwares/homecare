"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, FileText, Briefcase, Image as ImageIcon, MessageSquare, PhoneCall, Settings, LogOut, Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <Link href="/admin" className="text-xl font-bold text-primary flex items-center">
            <span className="text-accent text-2xl mr-1">+</span> Admin Panel
          </Link>
          <button className="md:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary-50 text-primary font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/services" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Briefcase className="w-5 h-5" /> Services
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/careers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <FileText className="w-5 h-5" /> Careers
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/blogs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <FileText className="w-5 h-5" /> Blogs
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/gallery" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <ImageIcon className="w-5 h-5" /> Gallery
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/testimonials" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <MessageSquare className="w-5 h-5" /> Testimonials
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/inquiries" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <PhoneCall className="w-5 h-5" /> Inquiries
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Header for Mobile & Quick Actions */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="md:hidden text-lg font-bold text-primary">Admin Panel</div>
          </div>
          <div className="hidden md:block text-sm text-gray-500">Welcome back, Admin</div>
          <div className="flex items-center gap-4">
             <Link href="/" target="_blank" className="text-sm font-medium text-primary hover:underline">
               View Live Website
             </Link>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

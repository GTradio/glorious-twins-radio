"use client";

import {
  Calendar,
  Headphones,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Newspaper,
  Radio,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/programs", label: "Programs", icon: Calendar },
  { href: "/admin/podcasts", label: "Podcasts", icon: Headphones },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/contacts", label: "Contacts", icon: MessageCircle },
  { href: "/admin/team", label: "Team", icon: User },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[47] lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-[49]
        bg-gradient-to-b from-emerald-900 to-emerald-950 dark:from-gray-900 dark:to-gray-950
        text-white w-64 flex flex-col shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-emerald-800/50 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Radio className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-400 dark:text-emerald-500" />
            <div>
              <h1 className="text-lg lg:text-xl font-bold leading-tight">
                Glorious Twins Radio
              </h1>
            </div>
          </div>
          <p className="text-emerald-300 dark:text-emerald-400 text-sm mt-2 font-medium">
            Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 lg:px-4 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500 dark:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                    : "hover:bg-emerald-800/50 dark:hover:bg-gray-800 text-emerald-100 dark:text-gray-300 hover:text-white dark:hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 lg:p-4 border-t border-emerald-800/50 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl w-full hover:bg-emerald-800/50 dark:hover:bg-gray-800 text-emerald-100 dark:text-gray-300 hover:text-white dark:hover:text-white transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;

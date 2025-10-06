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
          className="fixed inset-0 bg-black/35  z-[47] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
				fixed lg:static inset-y-0 left-0 z-[49]
				bg-gradient-to-b from-green-900 to-green-950 text-white 
				w-64 flex flex-col
				transform transition-transform duration-300 ease-in-out
				${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
			`}
      >
        {/* Header */}
        <div className="p-4 lg:p-6">
          <div className="flex items-center gap-3">
            <Radio className="w-6 h-6 lg:w-8 lg:h-8 text-orange-400" />
            <h1 className="text-xl lg:text-2xl font-bold">FM RADIO</h1>
          </div>
          <p className="text-green-300 text-sm mt-2">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 lg:px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose} // Close sidebar on mobile when link is clicked
                className={`flex items-center gap-3 px-3 lg:px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "hover:bg-green-800 text-green-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 lg:p-4 border-t border-green-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 lg:px-4 py-3 rounded-lg w-full hover:bg-green-800 text-green-100 transition-all"
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

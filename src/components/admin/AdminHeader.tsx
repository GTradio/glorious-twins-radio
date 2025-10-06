"use client";

import { Menu, User, X } from "lucide-react";
import { useSession } from "next-auth/react";

interface AdminHeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

const AdminHeader = ({ onMenuToggle, isSidebarOpen }: AdminHeaderProps) => {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Mobile menu button and search */}
        <div className="flex items-center gap-3 flex-1 lg:flex-none">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

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
    <header className="bg-white dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-600/30 sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Mobile menu button */}
        <div className="flex items-center gap-3 flex-1 lg:flex-none">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
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
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Administrator
              </p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-emerald-500/30 dark:ring-emerald-500/50 transition-all">
              <User className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

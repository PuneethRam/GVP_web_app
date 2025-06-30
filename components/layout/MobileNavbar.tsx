'use client';

import Link from 'next/link';
import { Home, MapPin, BarChart2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function MobileNavbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
      <nav className="flex justify-around">
        <Link 
          href="/" 
          className={cn(
            "flex flex-col items-center py-3 transition-colors",
            isActive('/') 
              ? "text-blue-600" 
              : "text-gray-500 hover:text-blue-600"
          )}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          href="/report-gvp" 
          className={cn(
            "flex flex-col items-center py-3 transition-colors",
            isActive('/report-gvp') 
              ? "text-blue-600" 
              : "text-gray-500 hover:text-blue-600"
          )}
        >
          <MapPin className="h-6 w-6" />
          <span className="text-xs mt-1">Report</span>
        </Link>
        
        {/* <Link 
          href="/dashboard" 
          className={cn(
            "flex flex-col items-center py-3 transition-colors",
            isActive('/dashboard') 
              ? "text-blue-600" 
              : "text-gray-500 hover:text-blue-600"
          )}
        >
          <BarChart2 className="h-6 w-6" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link> */}
      </nav>
    </div>
  );
}

export default MobileNavbar;
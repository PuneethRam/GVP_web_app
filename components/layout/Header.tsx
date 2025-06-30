'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-6",
        isScrolled 
          ? "bg-white dark:bg-gray-900 shadow-md" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Trash2 className="h-6 w-6 text-blue-600" />
          <span className="font-semibold text-lg">Report the GVP</span>
        </Link>
        
        <div className="hidden md:flex space-x-4">
          {/* <Link 
            href="/report-gvp" 
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Report
          </Link> */}
          {/* <Link 
            href="/dashboard" 
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link> */}
        </div>
      </div>
    </header>
  );
}

export default Header;
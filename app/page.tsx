import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, BarChart2, Trash2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-6">
          <Trash2 className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Help Keep Our Community Clean
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Report garbage vulnerable points (GVP) in your area and contribute to a cleaner environment. 
          Your reports help identify problem areas that need attention.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/report-gvp">
              Report GVP <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">
              View Dashboard
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mt-16">
        <div className="bg-white dark:bg-gray-950 rounded-lg border shadow-sm p-6">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Report Issues</h3>
          <p className="text-muted-foreground">
            Quickly report garbage issues with photos, videos, and precise location data to help identify problem areas.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-950 rounded-lg border shadow-sm p-6">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <BarChart2 className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
          <p className="text-muted-foreground">
            Monitor the status of your reports and see how your contributions are making a difference in the community.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-950 rounded-lg border shadow-sm p-6">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Trash2 className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Cleaner Community</h3>
          <p className="text-muted-foreground">
            Help create a cleaner, healthier environment for everyone by identifying and addressing garbage vulnerable points.
          </p>
        </div>
      </div>
    </div>
  );
}
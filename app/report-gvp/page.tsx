import { Metadata } from 'next';
import ReportForm from '@/components/report-gvp/ReportForm';

export const metadata: Metadata = {
  title: 'Report GVP | Garbage Reporting System',
  description: 'Report garbage vulnerable points in your area',
};

export default function ReportGVP() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/image.png')" }}
    >
      <div className="bg-white/0 backdrop-blur-sm min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-6 w-6 bg-blue-600 rounded-md"></div>
            <h1 className="text-lg font-medium">Report the GVP</h1>
          </div>
          <ReportForm />
        </div>
      </div>
    </div>
  );
}

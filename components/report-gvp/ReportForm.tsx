'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { GarbageLevel, GeoLocation, WasteType } from '@/types';
import { SampleImages } from './SampleImages';
import { LocationButton } from './LocationButton';
import FileUpload from './FileUpload';
import { nanoid } from 'nanoid';

function getISTTimestamp(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const istDate = new Date(now.getTime() + istOffset);

  const year = istDate.getUTCFullYear();
  const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istDate.getUTCDate()).padStart(2, '0');
  const hours = String(istDate.getUTCHours()).padStart(2, '0');
  const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(istDate.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Define waste type options
const wasteTypeOptions = [
  'Plastic',
  'Organic',
  'E-waste',
  'Medical',
  'Construction',
  'Household',
  'Industrial',
  'Other'
] as const;

// Updated schema to handle multiple waste types
const formSchema = z.object({
  garbageLevel: z.enum(['Low', 'Medium', 'High'] as const),
  wasteTypes: z.array(z.enum(wasteTypeOptions)).min(1, {
    message: "Please select at least one waste type"
  }),
  remarks: z.string().optional(),
});

export function ReportForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [wasteTypeDropdownOpen, setWasteTypeDropdownOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      garbageLevel: undefined,
      wasteTypes: [],
      remarks: '',
    },
  });

  // Function to add a waste type
  const addWasteType = (value: string) => {
    const currentValues = form.getValues().wasteTypes || [];
    if (!currentValues.includes(value as any)) {
      form.setValue('wasteTypes', [...currentValues, value as any]);
    }
  };

  // Function to remove a waste type
  const removeWasteType = (value: string) => {
    const currentValues = form.getValues().wasteTypes || [];
    form.setValue(
      'wasteTypes',
      currentValues.filter(item => item !== value)
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (files.length === 0) {
      setError('Please capture or upload at least one photo or video');
      return;
    }

    if (!location) {
      setError('Please enable location to continue');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const reportId = nanoid();

      // Upload files to Supabase Storage
      const uploadedPaths: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const filePath = `reports/${reportId}/${nanoid()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('reports')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Failed to upload file: ${uploadError.message}`);
        }

        uploadedPaths.push(filePath);
      }

      // Insert metadata into Supabase Database
      const { error: insertError } = await supabase.from('garbage_reports').insert([
        {
          id: reportId,
          garbage_level: values.garbageLevel,
          waste_type: values.wasteTypes, // Now storing an array of waste types
          remarks: values.remarks || '',
          location: location,
          media_paths: uploadedPaths,
          created_at: getISTTimestamp(),
        },
      ]);

      if (insertError) {
        throw new Error(`Failed to save report: ${insertError.message}`);
      }

      // Reset
      form.reset();
      setFiles([]);
      setLocation(null);
      setSuccess('Report submitted successfully!');
    } catch (err: any) {
      console.error('Error submitting report:', err);
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="garbageLevel"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Garbage Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wasteTypes"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <div 
                  className="flex flex-wrap gap-1 p-2 bg-white border rounded-md min-h-10"
                  onClick={() => setWasteTypeDropdownOpen(!wasteTypeDropdownOpen)}
                >
                  {field.value && field.value.length > 0 ? (
                    field.value.map((type) => (
                      <div 
                        key={type} 
                        className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 rounded-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>{type}</span>
                        <button
                          type="button"
                          onClick={() => removeWasteType(type)}
                          className="p-1 hover:bg-blue-200 rounded-full"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500">Select Waste Types</span>
                  )}
                </div>
                
                {wasteTypeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {wasteTypeOptions.map((type) => (
                      <div
                        key={type}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                          field.value?.includes(type as any) ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          addWasteType(type);
                          // Keep the dropdown open for multiple selections
                        }}
                      >
                        {type}
                      </div>
                    ))}
                    <div className="p-2 border-t">
                      <Button
                        type="button"
                        className="w-full"
                        variant="outline"
                        onClick={() => setWasteTypeDropdownOpen(false)}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add Remarks"
                  className="resize-none bg-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SampleImages />

        <FileUpload onFilesChange={setFiles} />

        <LocationButton onLocationChange={setLocation} />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm font-bold text-black">{success}</p>}

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}

export default ReportForm;
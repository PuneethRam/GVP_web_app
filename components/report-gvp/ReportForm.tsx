'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera } from 'lucide-react';
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

const formSchema = z.object({
  garbageLevel: z.enum(['Low', 'Medium', 'High'] as const),
  wasteType: z.enum([
    'Plastic',
    'Organic',
    'E-waste',
    'Medical',
    'Construction',
    'Household',
    'Industrial',
    'Other'
  ] as const),
  remarks: z.string().optional(),
});

export function ReportForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      garbageLevel: undefined,
      wasteType: undefined,
      remarks: '',
    },
  });

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
          waste_type: values.wasteType,
          remarks: values.remarks || '',
          location: location,
          media_paths: uploadedPaths,
          created_at: new Date().toISOString(),
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
          name="wasteType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Type of Waste" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plastic">Plastic</SelectItem>
                    <SelectItem value="Organic">Organic</SelectItem>
                    <SelectItem value="E-waste">E-waste</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Household">Household</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
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
        {success && <p className="text-sm text-green-600">{success}</p>}

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
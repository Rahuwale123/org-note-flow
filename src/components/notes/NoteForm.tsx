import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../../api/notes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface NoteFormProps {
  onSuccess?: () => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
  });

  const createMutation = useMutation({
    mutationFn: notesApi.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: 'Success',
        description: 'Note created successfully!',
      });
      reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create note',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: NoteFormData) => {
    createMutation.mutate({
      title: data.title,
      content: data.content,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter note title"
          {...register('title')}
          className="transition-all duration-200 focus:shadow-sm"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Enter note content"
          rows={4}
          {...register('content')}
          className="transition-all duration-200 focus:shadow-sm"
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            onSuccess?.();
          }}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={createMutation.isPending}
          className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
        >
          {createMutation.isPending ? 'Creating...' : 'Create Note'}
        </Button>
      </div>
    </form>
  );
};
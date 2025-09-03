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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Note } from '../../types';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface EditNoteDialogProps {
  note: Note;
  onClose: () => void;
}

export const EditNoteDialog: React.FC<EditNoteDialogProps> = ({ note, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: NoteFormData) => notesApi.updateNote(note.id, {
      title: data.title,
      content: data.content,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: 'Success',
        description: 'Note updated successfully!',
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update note',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: NoteFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Note'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '../../api/todos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Todo } from '../../types';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  completed: z.boolean(),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface EditTodoDialogProps {
  todo: Todo;
  onClose: () => void;
}

export const EditTodoDialog: React.FC<EditTodoDialogProps> = ({ todo, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo.title,
      completed: todo.completed,
    },
  });

  const completed = watch('completed');

  const updateMutation = useMutation({
    mutationFn: (data: TodoFormData) => todosApi.updateTodo(todo.id, {
      title: data.title,
      completed: data.completed,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: 'Success',
        description: 'Todo updated successfully!',
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update todo',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: TodoFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Todo</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              {...register('title')}
              className="transition-all duration-200 focus:shadow-sm"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="completed"
              checked={completed}
              onCheckedChange={(checked) => setValue('completed', !!checked)}
              className="data-[state=checked]:bg-success data-[state=checked]:border-success"
            />
            <Label htmlFor="completed" className="text-sm font-normal">
              Mark as completed
            </Label>
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
              {updateMutation.isPending ? 'Updating...' : 'Update Todo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
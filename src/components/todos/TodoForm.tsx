import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '../../api/todos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
  onSuccess?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string }) => todosApi.createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: 'Success',
        description: 'Todo created successfully!',
      });
      reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create todo',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: TodoFormData) => {
    createMutation.mutate({ title: data.title });
  };

  return (
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
          {createMutation.isPending ? 'Creating...' : 'Create Todo'}
        </Button>
      </div>
    </form>
  );
};
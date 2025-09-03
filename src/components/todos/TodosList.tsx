import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '../../api/todos';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit, Plus, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TodoForm } from './TodoForm';
import { EditTodoDialog } from './EditTodoDialog';
import type { Todo } from '../../types';
import { cn } from '@/lib/utils';

interface TodosListProps {
  personalOnly?: boolean;
}

export const TodosList: React.FC<TodosListProps> = ({ personalOnly = false }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const { data: todos, isLoading, error } = useQuery({
    queryKey: ['todos', personalOnly],
    queryFn: personalOnly ? todosApi.getMyTodos : todosApi.getAllTodos,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { title: string; completed: boolean } }) =>
      todosApi.updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update todo',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: todosApi.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: 'Success',
        description: 'Todo deleted successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to delete todo',
        variant: 'destructive',
      });
    },
  });

  const handleToggleComplete = (todo: Todo) => {
    updateMutation.mutate({
      id: todo.id,
      data: {
        title: todo.title,
        completed: !todo.completed,
      },
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      deleteMutation.mutate(id);
    }
  };

  const canEdit = user?.role === 'ADMIN' || user?.role === 'MEMBER';
  const canDelete = user?.role === 'ADMIN';
  const canEditOwn = user?.role === 'MEMBER';
  const completedCount = todos?.filter(todo => todo.completed).length || 0;
  const totalCount = todos?.length || 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded flex-1"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <p className="text-destructive text-center">Failed to load todos</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <CheckSquare className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Todos</h2>
          <Badge variant="secondary">
            {completedCount}/{totalCount}
          </Badge>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Todo
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Create New Todo</CardTitle>
          </CardHeader>
          <CardContent>
            <TodoForm onSuccess={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      {todos && todos.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No todos yet</p>
              <p className="text-sm text-muted-foreground">Create your first todo to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Permission Info Card */}
          {user?.role === 'MEMBER' && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                  <CheckSquare className="h-4 w-4" />
                  <p className="text-sm font-medium">Member Permissions</p>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  You can create, view, and edit your own todos. Only admins can delete todos.
                </p>
              </CardContent>
            </Card>
          )}

          {todos?.map((todo) => (
            <Card 
              key={todo.id} 
              className={cn(
                "hover:shadow-md transition-all duration-200",
                todo.completed && "bg-muted/30"
              )}
            >
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleComplete(todo)}
                      disabled={updateMutation.isPending}
                      className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                    />
                    <div className="flex-1">
                      <p className={cn(
                        "font-medium transition-all duration-200",
                        todo.completed && "line-through text-muted-foreground"
                      )}>
                        {todo.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        By {todo.created_by_username} • {new Date(todo.created_at).toLocaleDateString()}
                        {todo.created_by === user?.id && (
                          <span className="ml-2 text-blue-600 dark:text-blue-400">(You)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {canEdit && (
                      <>
                        {(user?.role === 'ADMIN' || (canEditOwn && todo.created_by === user?.id)) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingTodo(todo)}
                            className="hover:bg-primary/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                    
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(todo.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingTodo && (
        <EditTodoDialog
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
        />
      )}
    </div>
  );
};
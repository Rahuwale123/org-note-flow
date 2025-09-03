import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../../api/notes';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NoteForm } from './NoteForm';
import { EditNoteDialog } from './EditNoteDialog';
import type { Note } from '../../types';

export const NotesList: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const { data: notes, isLoading, error } = useQuery({
    queryKey: ['notes'],
    queryFn: notesApi.getAllNotes,
  });

  const deleteMutation = useMutation({
    mutationFn: notesApi.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: 'Success',
        description: 'Note deleted successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to delete note',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteMutation.mutate(id);
    }
  };

  const canEdit = user?.role === 'ADMIN';

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded"></div>
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
          <p className="text-destructive text-center">Failed to load notes</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Notes</h2>
          <Badge variant="secondary">{notes?.length || 0}</Badge>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Create New Note</CardTitle>
          </CardHeader>
          <CardContent>
            <NoteForm onSuccess={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      {notes && notes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notes yet</p>
              <p className="text-sm text-muted-foreground">Create your first note to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes?.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-all duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-base">{note.title}</CardTitle>
                    <CardDescription>
                      By {note.created_by_username} • {new Date(note.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {canEdit && (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingNote(note)}
                        className="hover:bg-primary/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(note.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{note.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingNote && (
        <EditNoteDialog
          note={editingNote}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
};
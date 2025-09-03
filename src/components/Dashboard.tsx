import React, { useState } from 'react';
import { Navbar } from './layout/Navbar';
import { NotesList } from './notes/NotesList';
import { TodosList } from './todos/TodosList';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'notes' | 'todos';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('notes');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Team Workspace
          </h1>
          <p className="text-muted-foreground">
            Collaborate on notes and manage todos with your team
          </p>
        </div>

        {/* Tab Navigation */}
        <Card className="p-1 mb-8 inline-flex shadow-sm">
          <Button
            variant={activeTab === 'notes' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('notes')}
            className={cn(
              "flex items-center space-x-2",
              activeTab === 'notes' && "bg-primary text-primary-foreground shadow-sm"
            )}
          >
            <FileText className="h-4 w-4" />
            <span>Notes</span>
          </Button>
          <Button
            variant={activeTab === 'todos' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('todos')}
            className={cn(
              "flex items-center space-x-2",
              activeTab === 'todos' && "bg-primary text-primary-foreground shadow-sm"
            )}
          >
            <CheckSquare className="h-4 w-4" />
            <span>Todos</span>
          </Button>
        </Card>

        {/* Tab Content */}
        <div className="animate-in fade-in-50 duration-200">
          {activeTab === 'notes' && <NotesList />}
          {activeTab === 'todos' && <TodosList />}
        </div>
      </main>
    </div>
  );
};
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MoreHorizontal, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import { useState } from 'react';
import AddTaskModal from './AddTaskModal';
import { cn } from '../../utils/cn';

export default function KanbanColumn({ column, tasks }) {
  const [isAdding, setIsAdding] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      className="flex flex-col w-[320px] shrink-0 bg-gray-50/50 dark:bg-gray-900/20 rounded-xl max-h-full"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 cursor-pointer group">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">{column.title}</h3>
          <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Task List (Droppable area) */}
      <div 
        ref={setNodeRef}
        className={cn(
          "flex-1 overflow-y-auto px-4 pb-4 space-y-3 min-h-[150px] transition-colors",
          isOver && "bg-brand-50/50 dark:bg-brand-900/10 rounded-lg"
        )}
      >
        <SortableContext 
          items={tasks.map(t => t.id)} 
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </SortableContext>
      </div>

      {/* Add Task Button */}
      <div className="p-3 mt-auto">
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Task
        </button>
      </div>

      <AddTaskModal 
        open={isAdding} 
        onOpenChange={setIsAdding} 
        columnId={column.id} 
      />
    </motion.div>
  );
}

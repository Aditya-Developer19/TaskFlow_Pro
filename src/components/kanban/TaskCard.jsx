import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Calendar, GripVertical, Trash2, Edit2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { formatDate, isOverdue } from '../../utils/formatDate';
import { getPriorityColor } from '../../utils/priorityHelpers';
import { useDispatch } from 'react-redux';
import { deleteTask } from '../../features/kanban/kanbanThunks';
import { useState } from 'react';
import EditTaskModal from './EditTaskModal';

export default function TaskCard({ task, isOverlay }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: task });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const overdue = isOverdue(task.dueDate);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask({ taskId: task.id, columnId: task.columnId }));
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style}
        className="h-28 rounded-lg border-2 border-dashed border-brand-400 bg-brand-50/50 dark:border-brand-600 dark:bg-brand-900/20"
      />
    );
  }

  return (
    <motion.div
      layout
      initial={!isOverlay ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05 }}
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-white dark:bg-surface-cardDark p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
        isOverlay && "rotate-2 scale-105 shadow-xl ring-2 ring-brand-500"
      )}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="flex flex-col gap-3">
        {/* Labels, Priority & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap pr-6">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority?.toUpperCase()}
            </Badge>
            {task.labels?.map((label, i) => (
              <div key={i} className="w-6 h-1.5 rounded-full" style={{ backgroundColor: label.color || '#6366f1' }} />
            ))}
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-8">
            <button 
              onClick={handleEdit}
              className="p-1 text-gray-400 hover:text-brand-500 rounded transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-medium text-sm text-gray-900 dark:text-white leading-tight">
          {task.title}
        </h4>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className={cn(
            "flex items-center text-xs font-medium",
            overdue ? "text-red-600 dark:text-red-400" : "text-gray-500"
          )}>
            {task.dueDate && (
              <>
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {formatDate(task.dueDate)}
              </>
            )}
          </div>
          
          <Avatar 
            size="sm" 
            initials="User" 
            className="ring-2 ring-white dark:ring-surface-cardDark"
          />
        </div>
      </div>

      {isEditing && (
        <EditTaskModal 
          open={isEditing} 
          onOpenChange={setIsEditing} 
          task={task} 
        />
      )}
    </motion.div>
  );
}

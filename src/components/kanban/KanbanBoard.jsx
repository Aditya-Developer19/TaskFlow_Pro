import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import { moveTask, reorderTask } from '../../features/kanban/kanbanThunks';
import { motion } from 'framer-motion';

export default function KanbanBoard({ boardId }) {
  const dispatch = useDispatch();
  const columns = useSelector(state => state.kanban.columns);
  const tasks = useSelector(state => state.kanban.tasks);
  
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    
    // In a full implementation, we'd handle optimistic updates during dragOver for smoother UX
    // For now, relying on dragEnd is simpler and robust for the initial state shape
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find columns
    let activeColumnId = null;
    let overColumnId = null;
    let activeIndex = -1;
    let overIndex = -1;

    // First check if dropping on a task
    for (const col of columns) {
      if (col.taskIds.includes(activeId)) {
        activeColumnId = col.id;
        activeIndex = col.taskIds.indexOf(activeId);
      }
      if (col.taskIds.includes(overId)) {
        overColumnId = col.id;
        overIndex = col.taskIds.indexOf(overId);
      }
    }

    // If dropping on empty column dropzone
    if (!overColumnId) {
      const col = columns.find(c => c.id === overId);
      if (col) {
        overColumnId = col.id;
        overIndex = col.taskIds.length;
      }
    }

    if (!activeColumnId || !overColumnId) return;

    if (activeColumnId === overColumnId) {
      if (activeIndex !== overIndex) {
        dispatch(reorderTask({
          columnId: activeColumnId,
          fromIndex: activeIndex,
          toIndex: overIndex
        }));
      }
    } else {
      dispatch(moveTask({
        taskId: activeId,
        fromColId: activeColumnId,
        toColId: overColumnId,
        toIndex: overIndex >= 0 ? overIndex : columns.find(c => c.id === overColumnId).taskIds.length
      }));
    }
  };

  const activeTask = activeId ? tasks[activeId] : null;

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <motion.div 
        className="flex h-full overflow-x-auto overflow-y-hidden p-6 gap-6 items-start"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.08 } }
        }}
        initial="hidden"
        animate="show"
      >
        {columns.map((column) => {
          const columnTasks = column.taskIds.map(id => tasks[id]).filter(Boolean);
          return (
            <KanbanColumn 
              key={column.id} 
              column={column} 
              tasks={columnTasks} 
            />
          );
        })}
      </motion.div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.5" } } }),
      }}>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

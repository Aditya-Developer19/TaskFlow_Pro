import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Users } from 'lucide-react';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { Avatar } from '../components/ui/Avatar';
import { seedData } from '../utils/seedData';
import { setBoards, setColumns, setTasks, setStatus } from '../features/kanban/kanbanSlice';

export default function BoardPage() {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const { boards, status } = useSelector(state => state.kanban);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(setBoards(seedData.boards));
      dispatch(setColumns(seedData.columns));
      dispatch(setTasks(seedData.tasks));
      dispatch(setStatus('succeeded'));
    }
  }, [dispatch, status]);

  const board = boards[boardId] || Object.values(boards)[0];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {board?.title || 'Board'}
          </h2>
          <div className="hidden sm:flex items-center -space-x-2">
            <Avatar size="sm" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" className="ring-2 ring-white dark:ring-surface-dark" />
            <Avatar size="sm" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" className="ring-2 ring-white dark:ring-surface-dark" />
            <Avatar size="sm" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie" className="ring-2 ring-white dark:ring-surface-dark" />
            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-surface-dark flex items-center justify-center text-[10px] font-medium z-10 text-gray-600 dark:text-gray-300">
              <Users className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <KanbanBoard boardId={board?.id} />
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Users, ListTodo, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { seedData } from '../utils/seedData';
import { setBoards, setColumns, setTasks, setStatus } from '../features/kanban/kanbanSlice';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { boards, tasks, status } = useSelector(state => state.kanban);

  useEffect(() => {
    if (status === 'idle') {
      // Hydrate with seed data
      dispatch(setBoards(seedData.boards));
      dispatch(setColumns(seedData.columns));
      dispatch(setTasks(seedData.tasks));
      dispatch(setStatus('succeeded'));
    }
  }, [dispatch, status]);

  const taskList = Object.values(tasks);
  const completedTasks = taskList.filter(t => t.columnId === 'done').length;
  const inProgressTasks = taskList.filter(t => t.columnId === 'inprogress').length;

  const stats = [
    { name: 'Total Tasks', value: taskList.length, icon: ListTodo, color: 'text-blue-500' },
    { name: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'text-green-500' },
    { name: 'In Progress', value: inProgressTasks, icon: Clock, color: 'text-orange-500' },
    { name: 'Team Members', value: 3, icon: Users, color: 'text-purple-500' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back. Here&apos;s what&apos;s happening.</p>
        </div>
        <Button onClick={() => navigate('/app/dashboard')}>
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-6 flex items-center space-x-4 hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Recent Boards</h2>
            <Link to="/app/board/b-1" className="text-sm text-brand-600 hover:text-brand-500 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {Object.values(boards).map(board => (
              <Link key={board.id} to={`/app/board/${board.id}`} className="block">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{board.title}</span>
                  </div>
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                    Active
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Activity</h2>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No recent activity</p>
            <p className="text-xs text-gray-500 mt-1">Start collaborating with your team.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

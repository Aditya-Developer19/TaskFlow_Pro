import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { Dialog } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { addTask } from '../../features/kanban/kanbanThunks';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string().optional(),
});

export default function AddTaskModal({ open, onOpenChange, columnId }) {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'medium',
    }
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(addTask({
        ...data,
        columnId,
        assigneeId: null,
      })).unwrap();
      reset();
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) reset();
    }} title="Add New Task">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input 
          label="Title" 
          placeholder="What needs to be done?" 
          {...register('title')} 
          error={errors.title?.message}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
            placeholder="Add details..."
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select 
            label="Priority"
            options={[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
              { label: 'Urgent', value: 'urgent' }
            ]}
            {...register('priority')}
          />
          <Input 
            label="Due Date" 
            type="date"
            {...register('dueDate')} 
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create Task
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

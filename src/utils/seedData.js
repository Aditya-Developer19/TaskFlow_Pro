export const seedData = {
  workspace: {
    id: 'ws-1',
    name: 'Acme Corp',
    ownerId: 'u-1',
    members: [
      { uid: 'u-1', name: 'Alice Smith', email: 'alice@acme.com', role: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
      { uid: 'u-2', name: 'Bob Jones', email: 'bob@acme.com', role: 'Member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
      { uid: 'u-3', name: 'Charlie Day', email: 'charlie@acme.com', role: 'Member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' }
    ]
  },
  boards: {
    'b-1': { id: 'b-1', title: 'Product Roadmap', workspaceId: 'ws-1' },
    'b-2': { id: 'b-2', title: 'Marketing Q3', workspaceId: 'ws-1' },
    'b-3': { id: 'b-3', title: 'Engineering Sprint 12', workspaceId: 'ws-1' }
  },
  columns: [
    { id: 'todo', title: 'To Do', taskIds: ['t-1', 't-2'] },
    { id: 'inprogress', title: 'In Progress', taskIds: ['t-3'] },
    { id: 'review', title: 'In Review', taskIds: ['t-4'] },
    { id: 'done', title: 'Done', taskIds: ['t-5'] }
  ],
  tasks: {
    't-1': { id: 't-1', title: 'Design new landing page', priority: 'high', assigneeId: 'u-1', columnId: 'todo', dueDate: new Date(Date.now() + 86400000).toISOString() },
    't-2': { id: 't-2', title: 'Write blog post', priority: 'medium', assigneeId: 'u-2', columnId: 'todo', dueDate: null },
    't-3': { id: 't-3', title: 'Fix navigation bug', priority: 'urgent', assigneeId: 'u-3', columnId: 'inprogress', dueDate: new Date(Date.now() - 86400000).toISOString() },
    't-4': { id: 't-4', title: 'Review PR #42', priority: 'low', assigneeId: 'u-1', columnId: 'review', dueDate: null },
    't-5': { id: 't-5', title: 'Setup CI/CD', priority: 'high', assigneeId: 'u-3', columnId: 'done', dueDate: new Date(Date.now() - 172800000).toISOString() }
  }
};

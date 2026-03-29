import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, CheckCircle, Circle, User, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('/tasks');
      setTasks(data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    }
  };

  const fetchAdminData = async () => {
    try {
      const { data } = await axios.get('/users/admin/all');
      setAdminData(data.data);
    } catch {
      toast.error('Failed to load admin data');
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (user?.role !== 'admin') await fetchTasks();
      if (user?.role === 'admin') await fetchAdminData();
      setLoading(false);
    };
    load();
  }, [user]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask) return;
    try {
      await axios.post('/tasks', { task: newTask });
      setNewTask('');
      fetchTasks();
      toast.success('Task added');
    } catch {
      toast.error('Failed to add task');
    }
  };

  const toggleTask = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'incompleted' : 'completed';
    try {
      await axios.put(`/tasks/${id}`, { status: newStatus });
      fetchTasks();
    } catch {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`);
      fetchTasks();
      toast.success('Task deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="p-10 text-center font-black">LOADING...</div>;

  return (
    <div className="space-y-12">
      {/* USER TASKS SECTION (Only for non-admins) */}
      {user?.role !== 'admin' && (
        <section className="card-3d">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase size={32} />
            <h2 className="text-3xl font-black uppercase">My Tasks</h2>
          </div>

          <form onSubmit={addTask} className="flex gap-4 mb-8">
            <input
              type="text"
              className="input-3d flex-1"
              placeholder="Add new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button type="submit" className="btn-3d flex items-center gap-2">
              <Plus size={20} /> Add
            </button>
          </form>

          <div className="grid gap-4">
            {tasks.length === 0 ? (
              <p className="text-gray-500 italic">No tasks found. Get started!</p>
            ) : (
              tasks.map((t) => (
                <div key={t.task_id} className="card-3d flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleTask(t.task_id, t.status)}>
                      {t.status === 'completed' ? (
                        <CheckCircle className="text-green-600" size={24} />
                      ) : (
                        <Circle size={24} />
                      )}
                    </button>
                    <span className={`text-lg font-bold ${t.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                      {t.task}
                    </span>
                  </div>
                  <button onClick={() => deleteTask(t.task_id)} className="p-2 hover:bg-black hover:text-white transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ADMIN SECTION */}
      {user?.role === 'admin' && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <User size={32} />
            <h2 className="text-3xl font-black uppercase tracking-tight">System Overview (Admin)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminData.map((u) => (
              <div key={u.id} className="card-3d bg-gray-50">
                <div className="flex justify-between items-start mb-4 border-b-2 border-black pb-2">
                  <div>
                    <h3 className="text-xl font-black uppercase">{u.name}</h3>
                    <p className="text-sm font-bold text-gray-600">{u.email}</p>
                  </div>
                  <span className="px-2 py-1 bg-black text-white text-xs font-black uppercase">
                    {u.role}
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-gray-500">Tasks ({u.tasks?.length || 0})</h4>
                  <ul className="text-sm space-y-1">
                    {u.tasks?.map(task => (
                      <li key={task.task_id} className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`} />
                         {task.task}
                      </li>
                    ))}
                    {(!u.tasks || u.tasks.length === 0) && <li className="text-gray-400 italic">No tasks</li>}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;

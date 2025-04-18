import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TaskInput from "./TaskInput";
import TaskList from "./Tasklist";

const API_URL = "http://localhost:3003/api/todos";

function App() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`${API_URL}?userId=${user.sub}`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [user]);

  const addTask = useCallback(async (task) => {
    if (!user) return;
    const taskWithUserId = { ...task, userId: user.sub };
    try {
      const response = await axios.post(API_URL, taskWithUserId);
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setShowModal(false); // Close modal after adding
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }, [user]);

  const removeTask = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error removing task:", error);
    }
  }, []);

  const editTask = useCallback(async (id, updatedTask) => {
    if (!user) return;
    const updatedWithUserId = { ...updatedTask, userId: user.sub };
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedWithUserId);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? response.data : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }, [user]);

  const filteredTasks = filter === "All"
    ? tasks
    : tasks.filter((task) => task.tag.trim().toLowerCase() === filter.toLowerCase());

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      {isAuthenticated && (
        <aside className="w-64 bg-white shadow-md p-5">
          <h2 className="text-xl font-bold mb-4">Filters</h2>
          <label className="block mb-2 font-medium">Filter by Category:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
          </select>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-5">
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-4 mb-6 shadow rounded-md">
          <h1 className="text-3xl font-bold text-indigo-700">To-Do App</h1>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <p className="text-gray-700 font-medium">Welcome, {user.name}</p>
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Log In
            </button>
          )}
        </header>

        {/* Body Content */}
         {isAuthenticated && (
          <>
            {/* NEW: Add Task Button */}
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition mb-4"
            >
              + Add Task
            </button>

            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                  <TaskInput addTask={addTask} />
                  <button
                    onClick={() => setShowModal(false)}
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Task List */}
            <TaskList tasks={filteredTasks} removeTask={removeTask} editTask={editTask} />
          </>
        )}

        {!isAuthenticated && (
          <div className="text-center mt-10">
            <p className="mb-4 text-lg text-gray-700">Please log in to access your tasks.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

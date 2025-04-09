import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useMemo, useCallback,  } from "react";
import axios from "axios";
import TaskInput from "./TaskInput";
import TaskList from "./Tasklist";


const API_URL = "http://localhost:3003/api/todos";

function App() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

  const [tasks, setTasks] =useState([]);
  
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`${API_URL}?userId=${user.sub}`);
        console.log("Fetched tasks:", response.data); 
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    fetchTasks();
  }, [user]);

  
  const addTask = useCallback(async (task) => {
    if (!user) return;
    const taskWithUserId={
      ...task,
      userId: user.sub,
    };
    try {
      const response = await axios.post(API_URL, taskWithUserId);  
      console.log("Task added:", response.data);  
      setTasks((prevTasks) => [...prevTasks, response.data]); 
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
  
    const updatedWithUserId = {
      ...updatedTask,
      userId: user.sub,
    };
  
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

console.log("Filtered tasks:", filteredTasks); 
if (isLoading) return <div>Loading...</div>;

return (
  <div className="w-full max-w-lg mx-auto mt-10 p-5 bg-gray-100 shadow-lg rounded-lg">
    <h1 className="text-4xl font-bold text-center mb-6 text-indigo-700">To-Do App</h1>

    {!isAuthenticated ? (
      <div className="text-center">
        <p className="mb-4">Please log in to access your tasks.</p>
        <button
          onClick={() => loginWithRedirect()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Log In
        </button>
      </div>
    ) : (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-700 font-medium">Welcome, {user.name}</p>
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Log Out
          </button>
        </div>

        <TaskInput addTask={addTask} />
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Filter by Category:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <TaskList tasks={filteredTasks} removeTask={removeTask} editTask={editTask} />
      </>
    )}
  </div>
);

}
export default App;

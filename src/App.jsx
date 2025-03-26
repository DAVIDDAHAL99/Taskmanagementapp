import { useState, useEffect, useMemo, useCallback,  } from "react";
import axios from "axios";
import TaskInput from "./TaskInput";
import TaskList from "./Tasklist";
const API_URL = "http://localhost:3003/api/todos";

function App() {
  const [tasks, setTasks] =useState([]);
  
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        console.log("Fetched tasks:", response.data); 
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    fetchTasks();
  }, []);

  
  const addTask = useCallback(async (task) => {
    try {
      const response = await axios.post(API_URL, task);  
      console.log("Task added:", response.data);  
      setTasks((prevTasks) => [...prevTasks, response.data]); 
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }, []);
  const removeTask = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error removing task:", error);
    }
  }, []);
  

  const editTask = useCallback(async (id, updatedTask) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? response.data : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }, []);
  const filteredTasks = filter === "All"
  ? tasks
  : tasks.filter((task) => task.tag.trim().toLowerCase() === filter.toLowerCase());

console.log("Filtered tasks:", filteredTasks); 

return (
  <div className="w-full max-w-lg mx-auto mt-10 p-5 bg-gray-100 shadow-lg rounded-lg">
    <h1 className="text-4xl font-bold text-center mb-6 text-indigo-700">To-Do App</h1>
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
  </div>
);
}
export default App;

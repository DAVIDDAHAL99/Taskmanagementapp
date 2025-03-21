import { useState, useEffect, useMemo, useCallback, use } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";

function App() {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // const addTask = (task) => {
  //   const updatedTasks = [...tasks, task];
  //   setTasks(updatedTasks);
  // };
  const addTask= useCallback((task)=>{
     setTasks((prevTasks)=> [...prevTasks, task]);
  },[]);
    const removeTask= useCallback((index)=>{
     setTasks((prevTasks)=> prevTasks.filter ((_, i) => i !== index));
  },[]);

  // const removeTask = (index) => {
  //   const updatedTasks = tasks.filter((_, i) => i !== index);
  //   setTasks(updatedTasks);
  // };

  const editTask = useCallback( (index, updatedTask) => {
    setTasks((prevTasks)=>
    prevTasks.map((task,i)=> (i=== index? updatedTask:task)));
  },[]);

  const filteredTasks = useMemo(()=>{ return filter === "All" ? tasks : tasks.filter((task) => task.category.trim().toLowerCase() === filter.toLowerCase());
  }, [tasks,filter]);
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

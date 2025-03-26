import { useState, useCallback } from "react";

function TaskInput({ addTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory]= useState("Work");

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
  
    const newTask = {
      item: title, 
      description: description,  
      tag: category  
    };
  
    addTask(newTask);  
  
    setTitle("");
    setDescription("");
    setCategory("Work");
  }, [title, description, category, addTask]);

  return (
    <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-2xl font-semibold mb-2">Add Task</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Task title"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task description"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value= {category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>
        <button 
          type="submit" 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}

export default TaskInput;
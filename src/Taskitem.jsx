import { useState, useCallback, useEffect } from "react";

function TaskItem({ task, removeTask, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.item);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedCategory, setEditedCategory] = useState(task.tag);
  const [editedDeadline, setEditedDeadline] = useState(task.deadline || "");
  const [showNotification, setShowNotification] = useState(false); // NEW: Notification state

  const handleTitleChange = (e) => setEditedTitle(e.target.value);
  const handleDescriptionChange = (e) => setEditedDescription(e.target.value);

  const handleSave = useCallback(() => {
    if (!editedTitle.trim() || !editedDescription.trim()) return;

    // Check if deadline changed & task is active
    if (task.deadline !== editedDeadline && !task.completed) {
      setShowNotification(true); // Show notification
    }

    editTask(task.id, {
      item: editedTitle,
      description: editedDescription,
      tag: editedCategory,
      completed: task.completed,
      deadline: editedDeadline,
    });
    setIsEditing(false);
  }, [editedTitle, editedDescription, editedCategory, editedDeadline, task, editTask]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const toggleComplete = () => {
    editTask(task.id, {
      ...task,
      completed: !task.completed,
    });
  };

  const getCategoryColor = useCallback((category) => {
    switch (category) {
      case "Work":
        return "bg-blue-200 text-blue-800";
      case "Personal":
        return "bg-green-200 text-green-800";
      case "Urgent":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  }, []);

  const categoryClass = getCategoryColor(task.tag);

  return (
    <div className="p-3 bg-white shadow-sm rounded-md flex justify-between items-start min-h-[80px] relative">
      {isEditing ? (
        <div className="flex flex-col gap-2 w-full">
          <input
            type="text"
            value={editedTitle}
            onChange={handleTitleChange}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={editedDescription}
            onChange={handleDescriptionChange}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
          </select>
          <input
            type="date"
            value={editedDeadline}
            onChange={(e) => setEditedDeadline(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-200"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          {/* Task Info */}
          <div className="flex justify-between items-start">
          <div>
          <h4 className={`text-lg font-semibold ${task.completed ? "line-through text-gray-400" : ""}`}>
            {task.item}
          </h4>
          <p className={`text-gray-600 ${task.completed ? "line-through" : ""}`}>
            {task.description}
          </p>
          <p className={`text-sm font-semibold px-2 py-1 rounded-md w-max ${categoryClass}`}>
            {task.tag}
          </p>

          {/* Deadline block here */}
          {!task.completed && task.deadline && (
            <p className={`text-sm ${new Date(task.deadline) < new Date() ? "text-red-500" : "text-gray-600"}`}>
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </p>
          )}
        </div>

            <div className="flex items-center mt-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={toggleComplete}
                className="mr-1"
              />
              <span className="text-sm">Completed</span>
            </div>
          </div>

          {/* Buttons */}
          {!task.completed && (
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => removeTask(task.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-sm px-3 py-1 rounded-md shadow">
          Deadline set: {new Date(editedDeadline).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

export default TaskItem;

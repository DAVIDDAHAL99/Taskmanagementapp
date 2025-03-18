import TaskItem from "./Taskitem";

function TaskList({ tasks, removeTask , editTask }) {
  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold mb-3">Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks added yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map((task, index) => (
            <TaskItem key={index} task={task} index={index} removeTask={removeTask} editTask={editTask}  />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
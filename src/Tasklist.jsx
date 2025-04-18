import TaskItem from "./Taskitem";
import { useMemo } from "react";

function TaskList({ tasks, removeTask , editTask }) {
  const taskItems = useMemo(() => {
    return tasks.map((task) => (
      <TaskItem key={task.id} task={task} removeTask={removeTask} editTask={editTask} />
    ));
  }, [tasks, removeTask, editTask]);

  return (
    <div className="mt-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">

      <h3 className="text-2xl font-semibold mb-3">Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks added yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {taskItems}
        </div>
      )}
    </div>
  );
}

export default TaskList;

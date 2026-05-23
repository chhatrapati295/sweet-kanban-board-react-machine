import { useState } from "react";

interface IColumn {
  id: number;
  title: string;
  status: "PENDING" | "PROGRESS" | "DONE";
}

const COLUMNS_DATA: IColumn[] = [
  {
    id: 1,
    title: "Pending",
    status: "PENDING",
  },
  {
    id: 2,
    title: "Progress",
    status: "PROGRESS",
  },
  {
    id: 3,
    title: "Done",
    status: "DONE",
  },
];

const INITIAL_TASK_DATA: IColumn[] = [
  {
    id: 1,
    title:
      "Design responsive authentication screens for mobile and desktop users.",
    status: "PENDING",
  },
  {
    id: 2,
    title: "Implement OTP verification flow with auto focus and paste support.",
    status: "PROGRESS",
  },
  {
    id: 3,
    title:
      "Fix drag and drop reordering issue inside the Kanban board component.",
    status: "DONE",
  },
  {
    id: 4,
    title:
      "Optimize React components to reduce unnecessary re-renders in dashboard.",
    status: "PENDING",
  },
  {
    id: 5,
    title:
      "Integrate REST APIs and handle loading, error, and empty states properly.",
    status: "PROGRESS",
  },
  {
    id: 6,
    title:
      "Deploy frontend application to Vercel and configure environment variables.",
    status: "DONE",
  },
];

const Kanban = () => {
  const [columns, setColumns] = useState<IColumn[]>(INITIAL_TASK_DATA);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);

  const handleDrop = (status: "PENDING" | "PROGRESS" | "DONE") => {
    setColumns((prev) =>
      prev?.map((item) => {
        if (item?.id === draggedTaskId) {
          return { ...item, status: status };
        } else {
          return item;
        }
      })
    );
    setDraggedTaskId(null);
    setDropTarget(null);
  };

  const handleReorder = (targetTaskId: number) => {
    // stop if no task is being dragged
    if (!draggedTaskId) return;

    // create copy of tasks array
    const updatedTasks = [...columns];

    // get dragged task object
    const draggedTask = updatedTasks.find((task) => task.id === draggedTaskId);

    // stop if dragged task not found
    if (!draggedTask) return;

    // remove dragged task from old position
    const filteredTasks = updatedTasks.filter(
      (task) => task.id !== draggedTaskId
    );

    // find target position where task should be inserted
    const targetIndex = filteredTasks.findIndex(
      (task) => task.id === targetTaskId
    );

    // insert dragged task at target position
    filteredTasks.splice(targetIndex, 0, draggedTask);

    // update final reordered tasks
    setColumns(filteredTasks);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="">Kanban</h1>
      <ul className="flex">
        {COLUMNS_DATA?.map((column) => {
          return (
            <li
              onDragOver={(e) => {
                e.preventDefault();
                setDropTarget(column?.id);
              }}
              onDrop={() => handleDrop(column?.status)}
              className={`flex flex-col flex-1  ${
                dropTarget === column?.id &&
                "border-dashed border-4 border-green-400 bg-gray-100 scale-105 transition-all duration-500 ease-in-out"
              }`}
              key={column?.id}
            >
              <div className="p-2 text-center bg-blue-100 border border-gray-400 ">
                {column?.title}
              </div>
              <ul className="flex flex-col gap-4 p-4 border border-gray-400 flex-1">
                {columns
                  ?.filter((task) => task?.status === column?.status)
                  ?.map((task) => {
                    return (
                      <li
                        key={task?.id}
                        draggable
                        onDragStart={() => setDraggedTaskId(task?.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleReorder(task?.id)}
                        className="bg-gray-200 p-2 rounded-md cursor-grab"
                      >
                        {task?.title}
                      </li>
                    );
                  })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Kanban;

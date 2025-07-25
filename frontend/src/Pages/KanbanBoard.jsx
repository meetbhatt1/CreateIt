import React, { useState } from "react";

export const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    todo: [
      { id: "1", title: "Task 1" },
      { id: "2", title: "Task 2" },
    ],
    inProgress: [{ id: "3", title: "Task 3" }],
    Review: [{ id: "4", title: "Task 4" }],
    done: [{ id: "5", title: "Task 5" }],
  });

  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (task, sourceColumn) => {
    setDraggedTask({ ...task, from: sourceColumn });
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();

    if (!draggedTask || draggedTask.from === targetColumn) return;

    const updatedColumns = { ...columns };

    // Remove from source column
    updatedColumns[draggedTask.from] = updatedColumns[draggedTask.from].filter(
      (task) => task.id !== draggedTask.id
    );

    // Add to target column
    updatedColumns[targetColumn] = [
      ...updatedColumns[targetColumn],
      { id: draggedTask.id, title: draggedTask.title },
    ];

    setColumns(updatedColumns);
    setDraggedTask(null);
  };

  return (
    <div style={styles.board}>
      {Object.entries(columns).map(([columnName, tasks]) => (
        <div
          key={columnName}
          style={styles.column}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, columnName)}
        >
          <h3 style={styles.columnHeader}>{columnName.toUpperCase()}</h3>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={styles.card}
              draggable
              onDragStart={() => handleDragStart(task, columnName)}
            >
              {task.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Basic inline styles for simplicity
const styles = {
  board: {
    display: "flex",
    gap: "16px",
    padding: "16px",
    justifyContent: "center",
  },
  column: {
    backgroundColor: "#f0f0f0",
    padding: "16px",
    borderRadius: "8px",
    width: "250px",
    minHeight: "300px",
  },
  columnHeader: {
    textAlign: "center",
    marginBottom: "12px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "grab",
  },
};

export default KanbanBoard;

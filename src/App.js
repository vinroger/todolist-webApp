import React, { useState, useEffect } from "react";
import InputForm from './components/InputForm.js'
import Task from "./components/Task.js";

function App() {
  const [tasks, setTasks] = useState([]);

  function addTask(newTask) {
    if(tasks.includes(newTask)) {
      return;
    }
    setTasks(prevTasks => {
      return [...prevTasks, newTask];
    });
  }
  function deleteTask(id) {
    setTasks(prevTasks => {
      return prevTasks.filter((taskItem, index) => {
        return index !== id;
      });
    });
  }
  function editTask(id, input) {
    let newTasks = [...tasks];
    newTasks[id] = input;
    setTasks(newTasks)
  }

  return (
    <div className="bg-gradient-to-r from-cyan-200 to-blue-300 p-5">
    <h1 className="text-3xl p-3 m-2 mb-5 font-bold h-10">
      Get organized!
    </h1>
    <InputForm onAdd={addTask} />
    <h3 className="font-bold text-4xl p-5 my-5">To-Do List</h3>
      {tasks.map((taskItem, index) => {
        return (
          <Task
            key={index}
            id={index}
            content={taskItem}
            onDelete={deleteTask}
            onEdit = {editTask}
          />
        );
      })}

    </div>
  );
}

export default App;

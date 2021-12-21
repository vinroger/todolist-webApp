import React, { useState, useEffect } from "react";
import InputForm from './InputForm.js'
import Task from "./Task.js";
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { db } from "./firebase"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function App() {
  const [tasks, setTasks] = useState([]); // {id : " ... ", title: " ... "}
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth()
  const history = useHistory();
  const usersCollectionRef = collection(db, "tasks");

  const fetchTasks = async () => {
    const data = await getDocs(usersCollectionRef);
    setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    return fetchTasks();
  }, []);

  async function addTask(newTask) {
    if(tasks.includes(newTask)) {
      return;
    }
    await addDoc(usersCollectionRef, { title: newTask });
    fetchTasks();

  }
  async function deleteTask(id) {
    const userDoc = doc(db, "tasks", id);
    await deleteDoc(userDoc);
    fetchTasks();
  }
  async function editTask(id, input) {
    const userDoc = doc(db, "tasks", id);
    const newFields = { title: input };
    await updateDoc(userDoc, newFields);
    fetchTasks();
  }
  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <div className="text-center">
      <h1 className="">
        Get organized!
      </h1>
      <InputForm onAdd={addTask} />
      <h3 className="">To-Do List</h3>
        {tasks.map((taskItem, index) => {
          return (
            <Task
              key={index}
              id={taskItem.id}
              content={taskItem.title}
              onDelete={deleteTask}
              onEdit = {editTask}
            />
          );
        })}
      <div className="" style={{position:'relative',top:100}} >
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>

    </div>
  );
}

export default App;

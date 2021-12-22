import React, { useState, useEffect } from "react";
import InputForm from './InputForm.js'
import Task from "./Task.js";
import { Button, ProgressBar } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { db, storage, auth } from "./firebase"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { Alert } from 'react-bootstrap';

function App() {
  const [tasks, setTasks] = useState([]); // {id : " ... ", title: " ... ", "imgSrc" : "..."}
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth()
  const history = useHistory();
  const usersCollectionRef = collection(db, "users", auth.currentUser.uid, "tasks");



//Fetch task for initial loading
  const fetchTasks = async () => {
    const data = await getDocs(usersCollectionRef);
    setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    return fetchTasks();
  }, []);

//upload images for the user
  const uploadFiles = (file, taskId) => {
    
    if (!file) return;
    const storageRef = ref(storage, `files/${auth.currentUser.uid}/${taskId}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      }, (error) => console.log(error), () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) =>{
        const userDoc = doc(db, "users", auth.currentUser.uid, "tasks", taskId);
        const newFields = { imgSrc : downloadURL };
        await updateDoc(userDoc, newFields);
        fetchTasks();
        });
      }
    );
  };

//add task, call the upload image (if available else will return nothing) store to firebase
  async function addTask(newTask) {
    if(tasks.includes(newTask)) {
      return;
    }
    await addDoc(usersCollectionRef, { title: newTask });
    fetchTasks();

  }
// delete task and call the fetch tasks to update
  async function deleteTask(id) {
    const userDoc = doc(db, "users", auth.currentUser.uid, "tasks", id);
    await deleteDoc(userDoc);
    const desertRef = ref(storage, `files/${auth.currentUser.uid}/${id}`);
    await deleteObject(desertRef)
    fetchTasks();
  }

// to edit the task and call the fetch tasks
  async function editTask(id, input) {
    const userDoc = doc(db, "users", auth.currentUser.uid, "tasks", id);
    const newFields = { title: input };
    await updateDoc(userDoc, newFields);
    fetchTasks();
  }

  async function delImg(id, input) {
    const userDoc = doc(db, "users", auth.currentUser.uid, "tasks", id);
    const newFields = { imgSrc: null };
    const desertRef = ref(storage, `files/${auth.currentUser.uid}/${id}`);
    await deleteObject(desertRef)
    await updateDoc(userDoc, newFields);
    fetchTasks();
  }

//For the logout button incase the log out fails -> alert will be notified to the user
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
      {error && <Alert variant="danger">{error}</Alert>}
      <h1 className="">
        Get organized!
      </h1>
      <InputForm onAdd={addTask} />
      <h3 className="">To-Do List</h3>
        {(progress < 100 && progress > 0)? 
          <div>
            <h2>Uploading... {progress}%</h2> 
            <ProgressBar now={progress} />
          </div>
          : <div></div>}
        {tasks.map((taskItem, index) => {
          return (
            <Task
              key={index}
              id={taskItem.id}
              content={taskItem.title}
              imgSrc = {taskItem.imgSrc}
              onDelete={deleteTask}
              onEdit = {editTask}
              onAddImg = {uploadFiles}
              onDelImg = {delImg}
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

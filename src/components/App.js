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
  query,
  orderBy

} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { Alert, Container, Card } from 'react-bootstrap';
import {color1, color2, color3, color4} from './Color';
import "./App.css"


function App() {
  const [tasks, setTasks] = useState([]); // The Schema looks like this {id : " ... ", title: " ... ", "imgSrc" : "...", "check" : " ..."}
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth()
  const history = useHistory();
  const usersCollectionRef = collection(db, "users", auth.currentUser.uid, "tasks");
  const orderedCollectionRef = query(usersCollectionRef, orderBy("timestamp"));



//Fetch task from database for initial loading
  const fetchTasks = async () => {
    const data = await getDocs(orderedCollectionRef);
    setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    
  };

  useEffect(() => {
    return fetchTasks();
  }, []);

//upload images for the user, store in database, re-fetch tasks to update UI (Upload Image Button)
//after the images get uploaded, will generate a URL which then will be passed in to corresponding components props.
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

//add task, store to firebase, re-fetch to update the UI
  async function addTask(newTask) {
    let exist = false;
    tasks.forEach((task)=>{
      if (task.title === newTask) {
        exist = true;
        return;
      }
    });
    if (exist){
      return;
    }
    await addDoc(usersCollectionRef, { title: newTask, checked: false, timestamp: Date.now() });
    fetchTasks();

  }
// delete tasks and their images (if available) and call the re-fetch tasks to update UI
  async function deleteTask(id) {
    const userDoc = doc(db, "users", auth.currentUser.uid, "tasks", id);
    await deleteDoc(userDoc);
    const desertRef = ref(storage, `files/${auth.currentUser.uid}/${id}`);
    try {
      await deleteObject(desertRef)
    }
    catch{

    }
    
    fetchTasks();
  }

//edit the task and call the re-fetch tasks to update UI
  async function editTask(id, input) {
    const userDoc = doc(db, "users", auth.currentUser.uid, "tasks", id);
    const newFields = { title: input };
    await updateDoc(userDoc, newFields);
    fetchTasks();
  }

//delete image (del img button): remove img-src props from the schema, remove file from storage, call re-fetch tasks to update UI
  async function delImg(id, input) {
    try {
      const userDoc = doc(db, "users", auth.currentUser.uid, "tasks", id);
      const newFields = { imgSrc: null };
      const desertRef = ref(storage, `files/${auth.currentUser.uid}/${id}`);
      await updateDoc(userDoc, newFields);
      fetchTasks();
      await deleteObject(desertRef)
    } catch (err){
      console.log(err);
    }
    
  }
// check the checkbox
  async function checkBox(id, value){
    const userDoc = doc(db, "users", auth.currentUser.uid, "tasks", id);
    const newFields = { checked: !value };
    await updateDoc(userDoc, newFields);
    fetchTasks();
  } 

//For the logout button incase the log out fails -> alert will be notified to the user, else bring the user to login page
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
    <div className="">
    <Container fluid>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="text-center roundedxl mb-5 text-dark title-card" style={{backgroundColor : color3}}>
        <Card.Body className="">
          <h3 className="">Add To-Do List</h3>
          <InputForm className="roundedxl" onAdd={addTask} />
      </Card.Body>
      </Card>

    {/* this is for incase the user upload a big size picture (takes time), 
    so the progress bar for upload is displayed to make it more interactive */}

        {(progress < 100 && progress > 0)? 
          <div className="mx-auto" style={{width: 400}}>
            <h2>Uploading... {progress}%</h2> 
            <ProgressBar now={progress} />
          </div>
          : <div></div>}

    {/* iterate through tasks to make components */}

        {tasks.map((taskItem, index) => {
          return (
            <Task
              key={index}
              id={taskItem.id}
              content={taskItem.title}
              imgSrc = {taskItem.imgSrc}
              checked = {taskItem.checked}
              onDelete={deleteTask}
              onEdit = {editTask}
              onAddImg = {uploadFiles}
              onDelImg = {delImg}
              onCheck = {checkBox}
            />
          );
        })}
      <br></br>
      <div className="" style={{position:'absolute',right:"1px",top :'1px'}} >
        <Button variant="secondary" className="m-2" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
      </Container>
    </div>
  );
}

export default App;

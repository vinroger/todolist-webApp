import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase"
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase"
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    setDoc
} from "firebase/firestore"

//This instantiate a hook for the user login info and its all function for it to be accessed across all documents,
//since we need these firebase auth function to be attached in login and signup page.
//Also, most of the function calling database needs a user ID which related to currentUser declared below from firebase authentication.
const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

//This exported function includes all the firebase auth functions needed for the login and signup page.
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    //When a new user is created, I want the todolist to be instantiated with pre-defined pictures and tasks to intro/demo the user ("Welcome to todolist, click this and that")
    async function initializeDatabase(){
        const usersCollectionRef = collection(db, "users", auth.currentUser.uid, "tasks");
        await addDoc(usersCollectionRef, { title: "Welcome to To Do List!", timestamp: Date.now(), checked: false });
        await addDoc(usersCollectionRef, { title: "<- Tick this Checkbox after you completed the task!", timestamp: Date.now(), checked: false });
        await addDoc(usersCollectionRef, { title: "Click to Add Image, Edit, and Delete ->", timestamp: Date.now(), imgSrc:"https://firebasestorage.googleapis.com/v0/b/todolist-77a88.appspot.com/o/husky.jpg?alt=media&token=74e79f43-f95d-4faf-aeed-afc81f45e295" , checked: false});
        return
    }
    //Sign Up the user, initialize template database
    async function signup(email, password) {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                email: email,
                password: password,
            });
            await initializeDatabase();
        }
        catch(err){
            console.log(err);
        }
        
    }
    //Login Function
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }
    //Logout Function
    function logout() {
        return signOut(auth)
    }
    // Add a listener if the user changed
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        login,
        signup,
        logout,
    }

    return (
        // the value is passed in to the provider
        <AuthContext.Provider value={value}>
        {!loading && children}
        </AuthContext.Provider>
    )
}
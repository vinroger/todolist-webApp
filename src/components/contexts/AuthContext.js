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

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

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
    async function initializeDatabase(){
        const usersCollectionRef = collection(db, "users", auth.currentUser.uid, "tasks");
        await addDoc(usersCollectionRef, { title: "Welcome to To Do List!", timestamp: Date.now() });
        await addDoc(usersCollectionRef, { title: "<- Tick this Checkbox after you completed the task!", timestamp: Date.now() });
        await addDoc(usersCollectionRef, { title: "Click to Add Image, Edit, and Delete ->", timestamp: Date.now(), imgSrc:"https://firebasestorage.googleapis.com/v0/b/todolist-77a88.appspot.com/o/husky.jpg?alt=media&token=74e79f43-f95d-4faf-aeed-afc81f45e295"});
        return
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }
    function logout() {
        return signOut(auth)
    }

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
        <AuthContext.Provider value={value}>
        {!loading && children}
        </AuthContext.Provider>
    )
}
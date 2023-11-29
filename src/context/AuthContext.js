import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import Toastify from "../components/Toastify";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  async function signUp(displayName, email, password) {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          setDoc(doc(db, "users", email), {
            savedShows: [],
          });
        })
        .then(() => {
          const user = auth.currentUser;
          setUser({ ...user, displayName });
          updateProfile(user, {
            displayName: displayName,
          });
        })
        .then(() => {
          Toastify("Account created successfully!");
        });
    } catch (err) {
      Toastify(err.message);
      console.log(err);
    }
  }

  async function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logOut() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  });

  return (
    <AuthContext.Provider value={{ signUp, logIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function UserAuth() {
  return useContext(AuthContext);
}

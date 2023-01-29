import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";

type User = {
    id: string,
    name: string,
    avatar: string;
}

type AuthContextType = {
    user: User | undefined,
    SignInWithGoogle: () => Promise<void>;
}

type AuthContextPrividerProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType);



export function AuthContextPrivider(props:AuthContextPrividerProps) {
    const [user, setUser] = useState<User>()

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
  
          const { displayName, photoURL, uid } = user;
  
          if (!displayName || !photoURL) {
            throw new Error('Faltando informações da conta do Google');
          }
  
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          });
        }
  
        return () => {
          unsubscribe();
        }
      })
    })
  
  
    async function SignInWithGoogle() {
      const provider = new GoogleAuthProvider();
  
      const result = await signInWithPopup(auth, provider)
  
      if (result.user) {
        const { displayName, photoURL, uid } = result.user;
  
        if (!displayName || !photoURL) {
          throw new Error('Faltando informações da conta do Google')
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    }

    return (
        <AuthContext.Provider value={{ user, SignInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}
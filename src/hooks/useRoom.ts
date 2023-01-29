import { off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./UseAuth";

type Question = {
    id: string,
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likeCount: number,
    likeId: string | undefined;
}
type FirebaseQuestions = Record<string, {
    id: string,
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likes: Record<string, {
        author: string;
    }>
}>

export function useRoom(roomId: string){
    const [question, setQuestion] = useState<Question[]>([]);
    const [title, setTitle] = useState('')
    const { user } = useAuth();
    useEffect(() => {
        const roomRef = ref(database, `rooms/${roomId}`);

        onValue(roomRef, (snapshot) => {
            const databaseRoom = snapshot.val();
            const FirebaseQuestions = databaseRoom.questions as FirebaseQuestions ?? {};
            const parsedQuestions = Object.entries(FirebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.author === user?.id)?.[0 ]
                }
            })
            setTitle(databaseRoom.title)
            setQuestion(parsedQuestions)

        })

        return () =>{
            off(roomRef, 'value')
        }

    }, [roomId, user?.id]);

    return { question, title }
}
import deleteImage from '../assets/delete.svg';
import checkImage from '../assets/check.svg';
import answerImage from '../assets/answer.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import '../styles/room.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { ref, remove, update } from 'firebase/database';
import { database } from '../services/firebase';
import { Logo } from '../components/Logo';

type RoomParams = {
    id: string;
}




export function AdminRoom() {
    useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const navigate = useNavigate();
    const { title, question } = useRoom(roomId as string);

    async function HandleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que quer deletar essa pergunta?')) {
            const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
            await remove(questionRef)
        }
    }

    async function HandleQuestionAsAnswered(questionId: string) {
        const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
        await update(questionRef, {
            isAnswered: true
        })

    }
    async function HandleHighlightQuestion(questionId: string) {
        const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
        await update(questionRef, {
            isHighlighted: true
        })
    }

    async function HandleEndRoom() {
        const roomRef = ref(database, `rooms/${roomId}`)

        update(roomRef, {
            endedAt: new Date()
        })
        navigate('/')
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <Logo />
                    <div>
                        <RoomCode code={roomId as string} />
                        <Button
                            onClick={HandleEndRoom}
                            isOutlined

                        >Encerrar sala</Button>
                    </div>
                </div>


            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {question.length > 0 && <span>{question.length} pergunta{'(s)'}</span>}
                </div>



                <div className="question-list">
                    {question.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >

                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => HandleQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImage} alt="Marcar pergunta como respondida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => HandleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImage} alt="Dar destaque à pergunta" />
                                        </button>
                                        
                                    </>
                                )}
                                <button
                                            type="button"
                                            onClick={() => HandleDeleteQuestion(question.id)}
                                        >
                                            <img src={deleteImage} alt="Deletar pergunta" />
                                        </button>

                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}
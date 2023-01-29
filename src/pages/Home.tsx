import IllustrationImg from '../assets/illustration.svg';
import Logo from '../assets/logo.svg';
import GoogleIconImage from '../assets/google-icon.svg';
import '../styles/auth.scss';

import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';
import { ref, get, child } from 'firebase/database';

export function Home() {
    const navigate = useNavigate();
    const { user, SignInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('')

    async function handleCreateRoom() {
        if (!user) {
            await SignInWithGoogle();
        }
        navigate('/rooms/new');
    }
    async function HandleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const dbRef = ref(database);
         get(child(dbRef, `rooms/${roomCode}`)).then((snapshot) => {
            if (!snapshot.exists()) {
                alert('Sala inexistente.')
                return;
            } 
            if(snapshot.val().endedAt){
                alert('Sala já encerrada.')
                return;
            }
            navigate(`rooms/${roomCode}`);
        }).catch((error) => {
            console.error(error);
        });

    }
    return (
        <div id="page-auth">
            <aside>
                <img src={IllustrationImg} alt="Ilustração perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiencia em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={Logo} alt="Letmeask" />
                    <button className="create-room" onClick={handleCreateRoom}>
                        <img src={GoogleIconImage} alt="Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={HandleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}
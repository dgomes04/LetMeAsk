import { Link, useNavigate } from 'react-router-dom';
import{ FormEvent, useState } from 'react';
import IllustrationImg from '../assets/illustration.svg';
import Logo from '../assets/logo.svg';
import { Button } from '../components/Button';
import '../styles/auth.scss';
import { useAuth } from '../hooks/UseAuth';
import { database } from '../services/firebase';
import {  ref, set, push } from 'firebase/database';


export function NewRoom(){    
    const { user } = useAuth();
    const navigate = useNavigate();
    const [newRoom, setNewRoom] = useState('');

    async function HandleCreateRoom(event: FormEvent){
        event.preventDefault();
        
        if(newRoom.trim() === ''){
            return;
        }

        const roomsRef = ref(database, 'rooms');
        const newPost = push(roomsRef);

        await set(newPost, {
            title: newRoom,
            authorId: user?.id,
        })
        navigate(`/admin/rooms/${newPost.key}`)
    }
    return(
        <div id= "page-auth">
            <aside>
                <img src={IllustrationImg} alt="Ilustração perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiencia em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={Logo} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={HandleCreateRoom}>
                        <input 
                        type="text" 
                        placeholder="Nome da sala"
                        onChange={event => setNewRoom(event.target.value)}
                        value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
                </div>
            </main>
        </div>
    );
    
}

import copyImage from '../assets/copy.svg'
import '../styles/room-code.scss'

type RoomCodeProps = {
    code: string;
}
export function RoomCode(props: RoomCodeProps){
    function CopyRoomCodeToClipboard(){
        navigator.clipboard.writeText(props.code)
    }
    return(
        <button className="room-code" onClick={CopyRoomCodeToClipboard}>
            <div>
                <img src={copyImage} alt="copiar número da sala" />
            </div>
            <span>Sala {props.code}</span>
        </button>
    );
}
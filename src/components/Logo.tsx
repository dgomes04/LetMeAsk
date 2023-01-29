import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
export function Logo(){
    return(
        <Link to={'/'}><img src={logo} alt="Logo Letmeask" className='logo'></img></Link>
    )
}
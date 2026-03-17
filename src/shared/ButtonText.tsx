import './ButtonText.css';
import { FaWhatsapp, FaSms } from "react-icons/fa";

interface props {
    text: string;
    sendOnText: string;
    smsStyle?: boolean
}

export const ButtonText = ({ text, sendOnText, smsStyle }: props) => {
    return (
        <a href={sendOnText} target="_blank" rel="noopener noreferrer" className={`btn ${smsStyle ? 'btn-yellow' : 'btn-whatsapp'}`}>
            {smsStyle ? <FaSms size={18} /> : <FaWhatsapp size={18} />}
            {text}
        </a>
    )
}

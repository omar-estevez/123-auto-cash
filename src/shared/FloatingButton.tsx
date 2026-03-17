import { useState } from "react";
import "./FloatingButton.css";
import { FaPhoneAlt, FaSms, FaWhatsapp } from "react-icons/fa";

export const FloatingButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="fab-container">
            {/* Opciones */}
            <div className={`fab-options ${open ? "open" : ""}`}>
                <a
                    href="tel:+18324499104"
                    className="fab-item call"
                >
                    <FaPhoneAlt />
                </a>

                <a
                    href="https://wa.me/+18324499104?text=Hi%2C%20I%20want%20to%20sell%20my%20car%20or%20check%20parts%20availability.%20Can%20you%20help%20me%3F"
                    target="_blank"
                    className="fab-item whatsapp"
                >
                    <FaWhatsapp size={25} />
                </a>

                <a
                    href="sms:+18324499104?body=Hi%2C%20I%20want%20to%20sell%20my%20car%20or%20check%20parts%20availability.%20Can%20you%20help%20me%3F"
                    className="fab-item sms"
                >
                    <FaSms size={25} />
                </a>

            </div>

            {/* Botón principal */}
            <button
                className="fab-main"
                onClick={() => setOpen(!open)}
            >
                {open ? "✖" : "💬"}
            </button>
        </div>
    );
}

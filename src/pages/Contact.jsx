import "../styles/pages/contact.css";
const Contact = () => {
    return (
        <div className="contactwrapper">
            <div className="contact">
                <address>
                    <h2>Dane kontaktowe:</h2>
                    <ul>
                        <li>Telefon: 730 379 195</li>
                        <li>Email: <a href="emailto:bufet@gustocatering.com.pl">bufet@gustocatering.com.pl</a></li>
                        <li>Konto do płatności: mBank 79 1140 2004 0000 3902 7435 5046</li>
                    </ul>
                </address>
                <div className="openinghours">
                    <h2>Godziny otwarcia:</h2>
                    <p>Pon. - Pt.: 8:00 - 15:30</p>
                </div>
            </div>
        </div>
    )
}

export default Contact;
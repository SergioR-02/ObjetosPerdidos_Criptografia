import { ContactInfo } from "../../molecules/contactInfo/ContactInfo"
import "./Footer.scss"

export const Footer = () => (
  <footer className="footer">
    <div className="footer__container">
      <div className="footer__content">
        <ContactInfo />
      </div>
      <div className="footer__copyright">
        <p className="footer__text">&copy; {new Date().getFullYear()} Universidad Nacional de Colombia - Objetos Perdidos y Encontrados</p>
      </div>
    </div>
  </footer>
)

export default Footer
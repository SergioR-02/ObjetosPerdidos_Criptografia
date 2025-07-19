import "./ContactInfo.scss";

export const ContactInfo = () => (
  
  <div className="contactInfo">
      <h2 className="contactInfo__title">Contactanos</h2>
    <div className="contactInfo__social">
      <a href="https://twitter.com" target="_blank" className="styles.socialLink">
        <span className="icon twitterIcon"></span>
      </a>
      <a href="https://linkedin.com" target="_blank" className="styles.socialLink">
        <span className="icon linkedinIcon"></span>
      </a>
      <a href="https://github.com" target="_blank" className="styles.socialLink">
        <span className="icon githubIcon"></span>
      </a>
      <a href="https://instagram.com" target="_blank" className="styles.socialLink">
        <span className="icon instagramIcon"></span>
      </a>
    </div>
  </div>
  
)
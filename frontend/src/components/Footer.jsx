import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaGlobe,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* 🔶 Social Icons Bar */}
      <div className="footer-social">
        <a
          href="https://www.facebook.com/Jeskotech?mibextid=ZbWKwL"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FaFacebookF />
        </a>

        <a
          href="https://www.linkedin.com/company/jesko-technologies/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn />
        </a>

        <a
          href="https://instagram.com/jeskotech?igshid=ZDdkNTZiNTM="
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>

        <a
          href="https://wa.me/919884020566/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <FaWhatsapp />
        </a>

        <a
          href="https://www.jeskotech.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Website"
        >
          <FaGlobe />
        </a>
      </div>

      {/* 🔹 Main Footer */}
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-section">
          <h2 className="footer-logo">ShopX</h2>
          <p>Your trusted ecommerce platform</p>
        </div>

        {/* Navigation */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>
            Email:{" "}
            <a href="mailto:info@jeskotech.com">
              info@jeskotech.com
            </a>
          </p>

          <p>
            Phone:{" "}
            <a href="tel:+919884020566">
              +91 9884020566
            </a>
          </p>

          <p>
            <a
              href="https://maps.app.goo.gl/icf7wAsWonZe7NXT6"
              target="_blank"
              rel="noopener noreferrer"
            >
              18, Lal Bahathur Colony, F9 Ram Plaza,
              Aavarampalayam Road, Peelamedu,
              Coimbatore – 641004
            </a>
          </p>
        </div>
      </div>

      {/* 🔸 Bottom */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} ShopX. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

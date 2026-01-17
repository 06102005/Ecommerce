import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
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
          <Link to="info@jeskotech.com">Email: info@jeskotech.com </Link>
          <br></br>
          <Link to="tel:+919884020566">Phone: +91 9884020566</Link>
          <br></br>
          <Link to="https://maps.app.goo.gl/icf7wAsWonZe7NXT6"> Location:18, Lal Bahathur Colony,
F9 Ram Plaza,
Aavarampalayam Road, Peelamedu,
Coimbatore - 641004</Link>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} ShopX. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

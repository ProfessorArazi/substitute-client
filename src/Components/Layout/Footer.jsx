import { Helmet } from "react-helmet";
import logo from "../../assets/substitutes-logo-footer.png";

const Footer = () => {
  return (
    <>
      <Helmet>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css"
        />
        <link rel="stylesheet" href="assets/css/style.css"></link>
      </Helmet>

      <div className={"footer-basic"}>
        <footer>
          <div>
            <img className="footer-logo" src={logo} alt="logo" />
          </div>
          {/* <div className={.social}>
            <a href="https://www.instagram.com/cristiano/">
              <i className="icon ion-social-instagram"></i>
            </a>
            <a href="https://www.facebook.com/leomessi">
              <i className="icon ion-social-facebook"></i>
            </a>
            <a href="https://api.whatsapp.com/send?phone=+972543438551">
              <i className="icon ion-social-whatsapp"></i>
            </a>
          </div> */}
          {/* <ul className="list-inline">
            <li className="list-inline-item">
              <Link to="/">מי אנחנו</Link>
            </li>
          </ul> */}
          <p className={"copyright"}>Amit Arazi © 2023</p>
        </footer>
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.bundle.min.js"></script>
    </>
  );
};

export default Footer;

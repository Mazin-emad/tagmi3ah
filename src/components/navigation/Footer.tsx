import { FaFacebook, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logoImage from "@/assets/imgs/logo.png";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container flex flex-col items-center justify-between p-6 mx-auto space-y-4 sm:space-y-0 sm:flex-row">
        <Link to="/">
          <img className="w-auto h-7" src={logoImage} alt="Logo" />
        </Link>

        <p className="text-sm text-muted-foreground">
          © Copyright {new Date().getFullYear()}. All Rights Reserved.
        </p>

        <div className="flex -mx-2">
          <a
            href="https://www.facebook.com"
            target="_blank"
            className="mx-2 text-muted-foreground transition-colors duration-300 hover:text-primary"
            aria-label="Reddit"
          >
            <FaFacebook className="size-5" />
          </a>

          <a
            href="https://www.x.com"
            target="_blank"
            className="mx-2 text-muted-foreground transition-colors duration-300 hover:text-primary"
            aria-label="Facebook"
          >
            <FaXTwitter className="size-5" />
          </a>

          <a
            href="https://www.Github.com"
            target="_blank"
            className="mx-2 text-muted-foreground transition-colors duration-300 hover:text-primary"
            aria-label="Github"
          >
            <FaGithub className="size-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { LearningArtwork } from "./Primitives";
export default function AuthLayout({
  eyebrow = "YOUR NEXT CHAPTER",
  title,
  description,
  children,
  wide = false,
}) {
  return (
    <div className={`auth-layout ${wide ? "auth-wide" : ""}`}>
      <aside className="auth-aside">
        <Link to="/" className="text-link">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <div>
          <span className="eyebrow">
            <Sparkles size={14} /> LEARNING, WITH A HUMAN TOUCH
          </span>
          <h2>
            A brighter future
            <br />
            starts with <em>you.</em>
          </h2>
          <p>
            Find the right guidance. Share what you know.
            <br />
            Make room for something extraordinary.
          </p>
        </div>
        <LearningArtwork />
        <p className="aside-footnote">
          <BookOpen size={17} /> A community built around your potential.
        </p>
      </aside>
      <section className="auth-form-side">
        <div className="auth-form-card">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="form-description">{description}</p>
          {children}
        </div>
      </section>
    </div>
  );
}

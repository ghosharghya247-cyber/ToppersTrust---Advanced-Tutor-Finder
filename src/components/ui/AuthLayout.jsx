import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
export default function AuthLayout({
  title,
  description,
  children,
  wide = false,
}) {
  return (
    <div className={`auth-layout ${wide ? "auth-wide" : ""}`}>
      <aside className="auth-aside">
        <Link to="/" className="text-link">
          <ArrowLeft size={16} />
          Back to home
        </Link>
        <div className="auth-welcome">
          <h2>
            Good guidance.
            <br />
            Growing confidence.
          </h2>
          <p>
            A place for curious minds, dedicated teachers, and the people
            cheering them on.
          </p>
        </div>
        <img
          className="auth-learning-photo"
          src="/images/learning-together.webp"
          alt="A tutor helping a learner with her studies"
          width="1536"
          height="1024"
        />
        <p className="aside-footnote">
          <BookOpen size={18} />A good place to grow.
        </p>
      </aside>
      <section className="auth-form-side">
        <div className="auth-form-card">
          <h1>{title}</h1>
          <p className="form-description">{description}</p>
          {children}
        </div>
      </section>
    </div>
  );
}

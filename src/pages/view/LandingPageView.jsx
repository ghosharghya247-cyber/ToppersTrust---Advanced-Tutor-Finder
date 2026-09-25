import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Compass,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  RolePicker,
  PasswordField,
  Notice,
  LearningArtwork,
} from "../../components/ui/Primitives";
export default function LandingPageView({
  role,
  email,
  password,
  showPassword,
  isLoading,
  signInError,
  handleRoleSelect,
  handleEmailChange,
  handlePasswordChange,
  toggleShowPassword,
  handleSignIn,
}) {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash)
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);
  return (
    <div className="landing">
      <section className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="status-dot" /> GOOD GUIDANCE. GREAT POSSIBILITIES.
          </span>
          <h1>
            A little guidance.
            <br />A <em>world</em> of
            <br />
            possibility.
          </h1>
          <p className="hero-description">
            The right tutor does more than teach a subject.
            <br className="desktop-only" /> They help you discover what you’re
            capable of.
          </p>
          <div className="hero-actions">
            <Link to="/browse-tutors" className="button button-primary">
              Find your tutor <ArrowUpRight size={19} />
            </Link>
            <Link to="/job-card" className="text-link">
              I want to teach <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-reassurance">
            <span>
              <Check size={15} /> Learning that fits you
            </span>
            <span>
              <Check size={15} /> Connections across Bangladesh
            </span>
          </div>
          <LearningArtwork />
        </div>
        <div className="login-column">
          <section className="login-card" aria-labelledby="login-title">
            <span className="eyebrow">
              <BookOpen size={15} /> YOUR NEXT CHAPTER
            </span>
            <h2 id="login-title">
              Welcome to your
              <br />
              learning space.
            </h2>
            <p className="muted">New possibilities are just a sign-in away.</p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSignIn();
              }}
            >
              <RolePicker value={role} onChange={handleRoleSelect} />
              <div className="field">
                <label htmlFor="login-email">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <PasswordField
                id="login-password"
                label="Password"
                value={password}
                onChange={handlePasswordChange}
                visible={showPassword}
                onToggle={toggleShowPassword}
              />
              <div className="form-support">
                <span>
                  <ShieldCheck size={14} /> Your space, securely
                </span>
                <Link to="/forgot-pass">Forgot password?</Link>
              </div>
              <Notice error>{signInError}</Notice>
              <button
                className="button button-primary button-full"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? "Signing you in…" : "Let’s get learning"}
                <ArrowRight size={18} />
              </button>
            </form>
            <p className="auth-switch">
              New to ToppersTrust?{" "}
              <Link to="/sign-up-frame">
                Create an account <ArrowUpRight size={13} />
              </Link>
            </p>
          </section>
          <div className="login-footnote">
            <Sparkles size={20} />
            <p>
              For curious minds. For dedicated teachers.
              <br />
              <strong>For a brighter tomorrow.</strong>
            </p>
          </div>
        </div>
      </section>
      <section
        className="subject-strip"
        aria-label="Explore learning opportunities"
      >
        <span>
          Room for every
          <br />
          <strong>kind of learner.</strong>
        </span>
        {["Mathematics", "Science", "English", "Bangla", "And beyond"].map(
          (item, i) => (
            <Link key={item} to="/browse-tutors">
              <span className="subject-symbol">
                {["∑", "⚛", "Aa", "অ", "↗"][i]}
              </span>
              {item}
            </Link>
          ),
        )}
      </section>
      <section id="how-it-works" className="how-section">
        <div className="section-intro">
          <span className="eyebrow">LESS SEARCHING. MORE LEARNING.</span>
          <h2>
            Your next chapter,
            <br />
            <em>in three simple steps.</em>
          </h2>
          <p>
            From the first connection to the first breakthrough,
            <br />
            make room for a better learning experience.
          </p>
        </div>
        <div className="steps-grid">
          {[
            {
              Icon: Compass,
              title: "Find your fit",
              copy: "Explore tutors or share your learning needs. Find someone who understands your goals.",
            },
            {
              Icon: BookOpen,
              title: "Make a connection",
              copy: "Build your shortlist, review profiles, and choose the guidance that feels right.",
            },
            {
              Icon: GraduationCap,
              title: "Grow together",
              copy: "Turn curiosity into confidence, one lesson and one small achievement at a time.",
            },
          ].map(({ Icon, title, copy }, i) => (
            <article className="step-card" key={title}>
              <div className="step-top">
                <Icon size={27} />
                <span>0{i + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="join-banner">
        <div>
          <span className="eyebrow">KNOWLEDGE IS BETTER SHARED</span>
          <h2>
            Someone’s next breakthrough
            <br />
            could start with you.
          </h2>
          <p>Bring your expertise. Help a learner find their confidence.</p>
        </div>
        <Link to="/sign-up-frame" className="button button-light">
          Start your journey <ArrowUpRight size={19} />
        </Link>
      </section>
      <section className="faq-section">
        <div>
          <span className="eyebrow">A LITTLE CLARITY</span>
          <h2>Before you begin.</h2>
        </div>
        <div className="faq-items">
          {[
            [
              "Who can join ToppersTrust?",
              "Guardians looking for learning support, tutors looking for opportunities, and tuition media partners can all create an account. Choose your role when signing up.",
            ],
            [
              "How do I find the right tutor?",
              "Browse tutor profiles or sign in as a guardian to post your requirements. Review subjects, qualifications, and location to build your shortlist.",
            ],
            [
              "Can I manage my tutoring profile?",
              "Yes. Sign in as a tutor to update your profile, explore tuition opportunities, and manage your account from your workspace.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

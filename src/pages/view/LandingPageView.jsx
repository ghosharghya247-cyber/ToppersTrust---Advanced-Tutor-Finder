import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Coins,
  GraduationCap,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  RolePicker,
  PasswordField,
  Notice,
} from "../../components/ui/Primitives";
import AuthLayout from "../../components/ui/AuthLayout";

function LoginForm(p) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        p.handleSignIn();
      }}
    >
      <RolePicker value={p.role} onChange={p.handleRoleSelect} />
      <div className="field">
        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={p.email}
          onChange={p.handleEmailChange}
          required
        />
      </div>
      <PasswordField
        id="login-password"
        label="Password"
        value={p.password}
        onChange={p.handlePasswordChange}
        visible={p.showPassword}
        onToggle={p.toggleShowPassword}
      />
      <div className="form-support">
        <span>
          <ShieldCheck size={14} /> Secure sign-in
        </span>
        <Link to="/forgot-pass">Forgot password?</Link>
      </div>
      <Notice error>{p.signInError}</Notice>
      <button
        className="button button-primary button-full"
        disabled={p.isLoading}
        type="submit"
      >
        {p.isLoading ? "Signing you in…" : "Log in"}
        <ArrowRight size={18} />
      </button>
      <p className="auth-switch">
        New to ToppersTrust? <Link to="/sign-up-frame">Create an account</Link>
      </p>
    </form>
  );
}
const subjects = [
  ["Mathematics", "π", "Build strong concepts. Solve with confidence.", "rose"],
  ["Science", "⚛", "Make sense of the world around you.", "green"],
  ["English", "Aa", "Find your voice, one word at a time.", "honey"],
  ["Bangla", "অ", "A stronger connection to language.", "lilac"],
];
const questions = [
  [
    "Who can join ToppersTrust?",
    "Guardians looking for learning support, tutors looking for opportunities, and tuition media partners can all create an account. Choose your role when signing up.",
  ],
  [
    "How do I find the right tutor?",
    "Search by subject and area, then compare tutors’ education, experience, availability, and expected salary. Sign in as a guardian to express interest, or post a tuition with your requirements.",
  ],
  [
    "Can I manage my tutoring profile?",
    "Yes. Sign in as a tutor to update your profile, explore tuition opportunities, and manage your account from your workspace.",
  ],
];
export default function LandingPageView(props) {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");
  useEffect(() => {
    if (hash)
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
  }, [hash]);
  if (pathname === "/login")
    return (
      <AuthLayout
        title="Welcome back."
        description="Your next connection is just a sign-in away."
      >
        <LoginForm {...props} />
      </AuthLayout>
    );
  const search = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (location.trim()) params.set("location", location.trim());
    navigate("/browse-tutors" + (params.size ? "?" + params.toString() : ""));
  };
  return (
    <div className="market-home">
      <section className="welcome-hero">
        <div className="welcome-copy">
          <h1>
            The right tutor.
            <br />A brighter
            <br className="hero-line-break" /> tomorrow.
          </h1>
          <p>
            A little support can change everything. Find a tutor who understands
            your learner, your goals, and your everyday life.
          </p>
          <form
            className="hero-search"
            onSubmit={search}
            aria-label="Find a tutor"
          >
            <div className="hero-search-field">
              <BookOpen size={19} />
              <div>
                <label htmlFor="home-subject">Subject</label>
                <select
                  id="home-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="">All subjects</option>
                  {[
                    "Mathematics",
                    "Physics",
                    "Chemistry",
                    "Science",
                    "English",
                    "Bangla",
                    "Biology",
                    "ICT",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="hero-search-field">
              <MapPin size={19} />
              <div>
                <label htmlFor="home-location">Location</label>
                <input
                  id="home-location"
                  placeholder="City or area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <button className="button button-primary" type="submit">
              <Search size={18} />
              <span>Search tutors</span>
            </button>
          </form>
          <div className="popular-subjects">
            <span>Popular:</span>
            {["Mathematics", "English", "Physics"].map((s) => (
              <Link key={s} to={"/browse-tutors?subject=" + s}>
                {s}
              </Link>
            ))}
          </div>
        </div>
        <figure className="welcome-photo">
          <img
            src="/images/learning-together.webp"
            alt="A tutor and learner sharing a moment of understanding over their studies"
            fetchPriority="high"
            width="1536"
            height="1024"
          />
          <figcaption>
            <BookOpen size={22} />
            <span>
              Good guidance.
              <br />
              Growing confidence.
            </span>
          </figcaption>
        </figure>
      </section>
      <section
        className="learning-promises"
        aria-label="Learning that fits your family"
      >
        {[
          [Users, "Get to know your tutor"],
          [CalendarDays, "Learning on your schedule"],
          [Coins, "Clear monthly pricing"],
        ].map(([Icon, text]) => (
          <div key={text}>
            <Icon size={24} strokeWidth={1.6} />
            <span>{text}</span>
          </div>
        ))}
      </section>
      <section className="subject-index">
        <div className="market-section-heading">
          <h2>A subject for every ambition.</h2>
          <Link className="text-link" to="/browse-tutors">
            Explore all subjects
            <ChevronRight size={17} />
          </Link>
        </div>
        <div className="subject-paths">
          {subjects.map(([name, symbol, description, tone]) => (
            <Link
              className={"subject-path " + tone}
              key={name}
              to={"/browse-tutors?subject=" + encodeURIComponent(name)}
            >
              <span className="subject-path-symbol" aria-hidden="true">
                {symbol}
              </span>
              <h3>{name}</h3>
              <p>{description}</p>
              <span className="subject-explore">
                Find a tutor
                <ChevronRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section id="how-it-works" className="learning-steps">
        <div>
          <h2>
            A little guidance.
            <br />A lasting difference.
          </h2>
          <p>
            Finding a tutor is personal. We make it easier to understand your
            options and take the next step with confidence.
          </p>
          <Link to="/browse-tutors" className="text-link">
            Find your tutor
            <ChevronRight size={17} />
          </Link>
        </div>
        <ol>
          {[
            [
              "Tell us what you need",
              "Choose a subject, your area, and a budget that works for your family.",
            ],
            [
              "Find your kind of teacher",
              "Compare education, experience, availability, and monthly pricing.",
            ],
            [
              "Start a conversation",
              "Sign in to express interest, or post a tuition with your requirements.",
            ],
          ].map(([title, copy], i) => (
            <li key={title}>
              <span className="step-number">{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="teacher-invitation">
        <GraduationCap size={38} strokeWidth={1.4} />
        <div>
          <h2>
            Someone’s next breakthrough
            <br /> could start with you.
          </h2>
          <p>Bring your expertise. Help a learner find their confidence.</p>
        </div>
        <Link className="button button-honey" to="/sign-up-frame">
          Become a tutor
          <ChevronRight size={18} />
        </Link>
      </section>
      <section className="market-faq">
        <h2>
          A little clarity
          <br /> before you begin.
        </h2>
        <div>
          {questions.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <Plus size={20} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

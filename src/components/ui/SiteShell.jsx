import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  LayoutDashboard,
  Menu,
  X,
  UserRound,
  Bookmark,
  Plus,
  Wallet,
  Building2,
  Search,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../../supabase";
import { Brand, Avatar } from "./Primitives";

const navigation = {
  guardian: [
    ["Overview", "/guardian-dashboard", LayoutDashboard],
    ["Find tutors", "/browse-tutors", Search],
    ["Post a tuition", "/guardian/post-job", Plus],
    ["My tuition posts", "/guardian/previous-jobs", BriefcaseBusiness],
    ["Shortlist", "/guardian/shortlisted", Bookmark],
    ["My profile", "/guardian/profile", UserRound],
  ],
  teacher: [
    ["Overview", "/tutor-dashboard", LayoutDashboard],
    ["Find a tuition", "/job-card", Search],
    ["My profile", "/tutor/profile", UserRound],
    ["Payments & dues", "/tutor/dues", Wallet],
  ],
  media: [
    ["Overview", "/media-dashboard", LayoutDashboard],
    ["Browse tutors", "/media/browse-tutors", Search],
    ["Request a tutor", "/media/post-job", Plus],
    ["Partner profile", "/media/profile", Building2],
  ],
};
export default function SiteShell({ children }) {
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setUser(data.session?.user || null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user || null),
    );
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menuOpen]);
  const authPage = [
    "/",
    "/login",
    "/sign-up-frame",
    "/forgot-pass",
    "/update-password",
  ].includes(pathname);
  const role = pathname.startsWith("/guardian")
    ? "guardian"
    : pathname.startsWith("/tutor")
      ? "teacher"
      : pathname.startsWith("/media")
        ? "media"
        : user?.user_metadata?.user_role;
  const items = navigation[role] || [];
  const workspace = !authPage && items.length > 0;
  const dashboard = navigation[user?.user_metadata?.user_role]?.[0]?.[1];
  return (
    <div className={`site-shell ${workspace ? "has-workspace" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/browse-tutors">Find a tutor</NavLink>
          <NavLink to="/job-card">Tuition board</NavLink>
          <Link to="/#how-it-works">How it works</Link>
        </nav>
        <div className="header-actions">
          {user && dashboard ? (
            <Link className="button button-primary button-small" to={dashboard}>
              Workspace <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link className="header-signin" to="/login">
                Log in
              </Link>
              <Link
                className="button button-primary button-small"
                to="/sign-up-frame"
              >
                Get started <ArrowRight size={15} />
              </Link>
            </>
          )}
          <button
            className="icon-button mobile-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label="Mobile navigation"
        >
          {(workspace
            ? items
            : [
                ["Find a tutor", "/browse-tutors", Search],
                ["Tuition board", "/job-card", BriefcaseBusiness],
                ["Log in", "/login", UserRound],
                ["Create account", "/sign-up-frame", Plus],
              ]
          ).map(([label, path, Icon]) => (
            <NavLink key={path} to={path}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
      {workspace && (
        <aside className="workspace-sidebar">
          <p className="sidebar-label">YOUR LEARNING SPACE</p>
          <nav aria-label="Workspace">
            {items.map(([label, path, Icon]) => (
              <NavLink key={path} end={path.endsWith("dashboard")} to={path}>
                <Icon size={19} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-note">
            <BookOpen size={25} />
            <h3>
              Progress begins
              <br />
              with connection.
            </h3>
            <p>A little guidance can make a big difference.</p>
          </div>
          <div className="sidebar-member">
            <Avatar name={user?.user_metadata?.full_name || "Your account"} />
            <div>
              <strong>
                {user?.user_metadata?.full_name || "Your account"}
              </strong>
              <small>
                {role === "teacher"
                  ? "Tutor"
                  : role === "media"
                    ? "Partner"
                    : "Guardian"}{" "}
                workspace
              </small>
            </div>
          </div>
        </aside>
      )}
      <main
        id="main-content"
        className={`site-content ${authPage ? "public-content" : "workspace-content"}`}
        tabIndex={-1}
      >
        {children}
      </main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} ToppersTrust</span>
        <span className="footer-note">
          <ShieldCheck size={15} /> Built around better learning.
        </span>
        <Link to="/terms-and-conditions">Terms & privacy</Link>
      </footer>
    </div>
  );
}

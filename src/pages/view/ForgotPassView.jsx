import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Mail } from "lucide-react";
import AuthLayout from "../../components/ui/AuthLayout";
import { Notice } from "../../components/ui/Primitives";
export default function ForgotPassView({
  email,
  setEmail,
  isLoading,
  message,
  handleSubmit,
}) {
  return (
    <AuthLayout
      eyebrow="LET’S GET YOU BACK"
      title="Forgot your password?"
      description="It happens. Enter your email and we’ll send you a link to reset it."
    >
      <span className="icon-tile sage auth-icon">
        <Mail size={26} />
      </span>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="reset-email">Email address</label>
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Notice>{message}</Notice>
        <button
          className="button button-primary button-full"
          disabled={isLoading}
        >
          {isLoading ? "Sending reset link…" : "Send reset link"}
          <ArrowRight size={18} />
        </button>
      </form>
      <Link className="back-link auth-back" to="/login">
        <ArrowLeft size={16} /> Back to log in
      </Link>
    </AuthLayout>
  );
}

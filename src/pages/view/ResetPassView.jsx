import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AuthLayout from "../../components/ui/AuthLayout";
import { PasswordField, Notice } from "../../components/ui/Primitives";
export default function ResetPassView({
  newPassword,
  confirmPassword,
  message,
  isLoading,
  showNewPassword,
  showConfirmPassword,
  handleNewPasswordChange,
  handleConfirmPasswordChange,
  toggleShowNewPassword,
  toggleShowConfirmPassword,
  handleSubmit,
}) {
  return (
    <AuthLayout
      eyebrow="A FRESH START"
      title="Set a new password."
      description="Choose a strong password you haven’t used before."
    >
      <form onSubmit={handleSubmit}>
        <PasswordField
          id="new-password"
          label="New password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          visible={showNewPassword}
          onToggle={toggleShowNewPassword}
          autoComplete="new-password"
          placeholder="At least 6 characters"
        />
        <PasswordField
          id="confirm-password"
          label="Confirm new password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          visible={showConfirmPassword}
          onToggle={toggleShowConfirmPassword}
          autoComplete="new-password"
        />
        <Notice>{message}</Notice>
        <button
          className="button button-primary button-full"
          disabled={isLoading}
        >
          {isLoading ? "Updating password…" : "Update password"}
          <ArrowRight size={18} />
        </button>
      </form>
      <p className="auth-switch">
        <Link to="/login">Back to log in</Link>
      </p>
    </AuthLayout>
  );
}

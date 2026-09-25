import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import AuthLayout from "../../components/ui/AuthLayout";
import {
  RolePicker,
  PasswordField,
  Notice,
} from "../../components/ui/Primitives";
export const GenderToggle = ({ value, onChange }) => (
  <div className="segmented-control">
    {["Male", "Female", "Other"].map((gender) => (
      <button
        key={gender}
        type="button"
        aria-pressed={value === gender}
        className={value === gender ? "selected" : ""}
        onClick={() => onChange(gender)}
      >
        {gender}
      </button>
    ))}
  </div>
);
export default function SignUpView({
  formData,
  formErrors,
  agreedToTerms,
  isLoading,
  signUpMessage,
  onInputChange,
  onGenderChange,
  onRoleChange,
  onSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const field = (
    name,
    label,
    type = "text",
    placeholder = "",
    autoComplete,
  ) => (
    <div className="field" key={name}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name] || ""}
        onChange={onInputChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        aria-invalid={!!formErrors[name]}
        aria-describedby={formErrors[name] ? name + "-error" : undefined}
      />
      {formErrors[name] && (
        <small className="field-error" id={name + "-error"}>
          {formErrors[name]}
        </small>
      )}
    </div>
  );
  return (
    <AuthLayout
      wide
      eyebrow="MAKE ROOM FOR POSSIBILITY"
      title="Start your next chapter."
      description="A few details today. A world of learning tomorrow."
    >
      <form onSubmit={onSubmit}>
        <RolePicker signup value={formData.role} onChange={onRoleChange} />
        {formErrors.role && <Notice error>{formErrors.role}</Notice>}
        <div className="form-grid">
          {field("name", "Full name", "text", "Your full name", "name")}
          {field("email", "Email address", "email", "you@example.com", "email")}
          {field("phone", "Phone number", "tel", "01XXXXXXXXX", "tel")}
          {field("city", "City", "text", "e.g. Dhaka", "address-level2")}
          {field(
            "location",
            "Area / location",
            "text",
            "e.g. Dhanmondi",
            "address-line1",
          )}
          <div className="field">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={formData.gender || ""}
              onChange={(e) => onGenderChange(e.target.value)}
              required
            >
              <option value="" disabled>
                Select gender
              </option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {formErrors.gender && (
              <small className="field-error">{formErrors.gender}</small>
            )}
          </div>
          <PasswordField
            id="password"
            label="Password"
            value={formData.password}
            onChange={onInputChange}
            visible={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            autoComplete="new-password"
            error={formErrors.password}
            placeholder="At least 6 characters"
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            value={formData.confirmPassword}
            onChange={onInputChange}
            visible={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
            autoComplete="new-password"
            error={formErrors.confirmPassword}
            placeholder="Re-enter your password"
          />
        </div>
        <label className="checkbox-field">
          <input
            type="checkbox"
            name="terms"
            checked={agreedToTerms}
            onChange={onInputChange}
            required
          />
          <span>
            I agree to the{" "}
            <Link
              to="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
            >
              terms and conditions
            </Link>
            .
          </span>
        </label>
        {formErrors.terms && <Notice error>{formErrors.terms}</Notice>}
        <Notice error={!!signUpMessage?.toLowerCase().match(/error|failed/)}>
          {signUpMessage}
        </Notice>
        <button
          className="button button-primary button-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating your account…" : "Create my account"}
          <ArrowRight size={18} />
        </button>
        <p className="auth-switch">
          Already part of the community? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  MapPin,
  RotateCcw,
  Search,
  Star,
  X,
} from "lucide-react";
import { Avatar } from "./Primitives";
import { InfoGrid } from "./ProfilePage";

export function SearchFilters({
  filters,
  onChange,
  onReset,
  count,
  noun = "opportunities",
}) {
  return (
    <div className="filter-bar">
      <div className="field">
        <label htmlFor="discovery-location">Location</label>
        <div className="search-input">
          <Search size={18} />
          <input
            id="discovery-location"
            type="search"
            value={filters.location}
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
            placeholder="Search by city or area…"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="discovery-gender">Tutor preference</label>
        <select
          id="discovery-gender"
          value={filters.gender}
          onChange={(e) => onChange({ ...filters, gender: e.target.value })}
        >
          <option value="any">Any gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>
      <button
        type="button"
        className="button button-secondary"
        onClick={onReset}
      >
        <RotateCcw size={16} /> Reset
      </button>
      <p className="filter-count" role="status">
        {count} {noun}
      </p>
    </div>
  );
}
export function TutorPreview({ tutor, children, compact = false }) {
  const name = tutor.name || tutor.displayName || "Tutor";
  const rating = Number(tutor.rating);
  return (
    <article className={"educator-card " + (compact ? "compact" : "")}>
      <div className="educator-top">
        <Avatar
          name={name}
          src={tutor.profileImageUrl || tutor.photoUrl || tutor.photo}
          size="large"
        />
        <span className="badge">
          <GraduationCap size={14} /> Educator
        </span>
      </div>
      <h2>{name}</h2>
      <p className="educator-school">
        {tutor.university ||
          tutor.uni ||
          tutor.qualification ||
          "ToppersTrust educator"}
      </p>
      <p className="educator-location">
        <MapPin size={15} />
        {tutor.location || tutor.city || "Location not provided"}
      </p>
      <div className="educator-highlights">
        <span>
          <Star size={14} />
          {rating > 0 ? rating.toFixed(1) + " / 5" : "Not yet rated"}
        </span>
        <span>
          {tutor.experience_years != null
            ? tutor.experience_years + " years experience"
            : "Experience not provided"}
        </span>
      </div>
      <InfoGrid
        fields={[
          [
            "Expected salary",
            tutor.expectedSalary || tutor.expected_salary
              ? "৳" + (tutor.expectedSalary || tutor.expected_salary)
              : "Not specified",
          ],
          [
            "Availability",
            tutor.availableTime || tutor.available_time || "Not specified",
          ],
        ]}
      />
      <details className="educator-more">
        <summary>
          Education & teaching details <span>+</span>
        </summary>
        <InfoGrid
          fields={[
            [
              "Department / qualification",
              tutor.department || tutor.qualification,
            ],
            ["University result", tutor.grade || tutor.uni_grade],
            ["Subjects", tutor.preferred_subjects],
            ["Classes", tutor.preferred_classes],
            ["Medium", tutor.medium],
            ["SSC", tutor.sscInfo || tutor.ssc_school],
            ["HSC", tutor.hscInfo || tutor.hsc_school],
          ]}
        />
      </details>
      {children && <div className="educator-actions">{children}</div>}
    </article>
  );
}
export function QueueActions({
  onSkip,
  onAccept,
  disabled,
  acceptLabel = "Select tutor",
  busy = false,
}) {
  return (
    <div className="queue-actions">
      <button
        className="button button-secondary"
        onClick={onSkip}
        disabled={disabled || busy}
      >
        <X size={17} /> Skip for now
      </button>
      <button
        className="button button-primary"
        onClick={onAccept}
        disabled={disabled || busy}
      >
        {busy ? "Saving…" : acceptLabel}
        <Check size={17} />
      </button>
    </div>
  );
}
export function Pagination({ page, pages, onChange }) {
  return (
    <nav className="pagination" aria-label="Results pages">
      <button
        className="button button-secondary button-small"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        <ArrowLeft size={15} /> Previous
      </button>
      <span aria-live="polite">
        Page {page} of {pages}
      </span>
      <button
        className="button button-secondary button-small"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
      >
        Next <ArrowRight size={15} />
      </button>
    </nav>
  );
}

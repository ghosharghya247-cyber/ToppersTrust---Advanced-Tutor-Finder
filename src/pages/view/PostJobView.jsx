import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  Lightbulb,
  MapPin,
  Plus,
  Send,
  X,
} from "lucide-react";
import { Notice, PageHeading } from "../../components/ui/Primitives";

export const GenderToggle = ({ name, label, value, onChange, options }) => (
  <fieldset className="field choice-field">
    <legend>{label}</legend>
    <div className="segmented-control">
      {options.map((option) => (
        <button
          type="button"
          name={name}
          key={option}
          aria-pressed={value === option}
          className={value === option ? "selected" : ""}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  </fieldset>
);
export const SelectInput = ({
  name,
  label,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div className="field">
    <label htmlFor={name}>
      {label}
      {required && <span className="required-mark"> *</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option || "Select " + label.toLowerCase()}
        </option>
      ))}
    </select>
  </div>
);
export const TextInput = ({
  name,
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  maxLength,
}) => (
  <div className="field">
    <label htmlFor={name}>
      {label}
      {required && <span className="required-mark"> *</span>}
    </label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      required={required}
      maxLength={maxLength}
      min={type === "number" ? 1 : undefined}
    />
  </div>
);

export default function PostJobView({
  formData: f,
  availableLocations,
  message,
  isLoading,
  subjectToAdd,
  subjectError,
  handlers: h,
  dataSources: d,
}) {
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="A BETTER LEARNING JOURNEY STARTS HERE"
        title="Post a tuition."
        description="Share your learner’s needs and help the right tutor find you."
      >
        <button
          className="button button-secondary button-small"
          onClick={h.handleCancel}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </PageHeading>
      <div className="form-layout">
        <form onSubmit={h.handleSubmit} className="tuition-form">
          <section className="panel form-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">01 · THE LEARNER</span>
                <h2>What would you like to learn?</h2>
              </div>
              <span className="icon-tile sage">
                <BookOpen size={23} />
              </span>
            </div>
            <div className="form-grid">
              <SelectInput
                name="noOfStudents"
                label="Number of students"
                value={f.noOfStudents}
                onChange={h.handleInputChange}
                options={d.studentCountOptions}
                required
              />
              <SelectInput
                name="category"
                label="Medium"
                value={f.category}
                onChange={h.handleInputChange}
                options={d.mediumOptions}
                required
              />
              <SelectInput
                name="classCourse"
                label="Class / course"
                value={f.classCourse}
                onChange={h.handleInputChange}
                options={d.classOptions}
                required
              />
              <GenderToggle
                name="studentGender"
                label="Student gender"
                value={f.studentGender}
                onChange={h.handleStudentGenderChange}
                options={["Male", "Female"]}
              />
            </div>
            <div className="field">
              <label htmlFor="subjectToAdd">
                Subjects <span className="muted">· choose up to 5</span>
              </label>
              <div className="subject-selection">
                {f.subjects.map((subject) => (
                  <span className="subject-chip" key={subject}>
                    {subject}
                    <button
                      type="button"
                      onClick={() => h.removeSubject(subject)}
                      aria-label={"Remove " + subject}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="input-action">
                <select
                  id="subjectToAdd"
                  value={subjectToAdd}
                  onChange={(e) => h.setSubjectToAdd(e.target.value)}
                >
                  {d.subjectOptions
                    .filter((option) => !f.subjects.includes(option))
                    .map((option) => (
                      <option value={option} key={option}>
                        {option || "Select a subject"}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={h.addSubject}
                  disabled={!subjectToAdd || f.subjects.length >= 5}
                >
                  <Plus size={16} /> Add
                </button>
              </div>
              {subjectError && (
                <small className="field-error" role="alert">
                  {subjectError}
                </small>
              )}
            </div>
          </section>
          <section className="panel form-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">02 · THE SETTING</span>
                <h2>Where will learning happen?</h2>
              </div>
              <span className="icon-tile sand">
                <MapPin size={23} />
              </span>
            </div>
            <div className="form-grid">
              <SelectInput
                name="city"
                label="City"
                value={f.city}
                onChange={h.handleInputChange}
                options={d.cityOptions}
                required
              />
              <SelectInput
                name="location"
                label="Area / location"
                value={f.location}
                onChange={h.handleInputChange}
                options={availableLocations}
                required
              />
              <TextInput
                name="address"
                label="Street address"
                value={f.address}
                onChange={h.handleInputChange}
                placeholder="House, road, flat number"
                required
                maxLength={150}
              />
              <SelectInput
                name="tuitionType"
                label="Tuition type"
                value={f.tuitionType}
                onChange={h.handleInputChange}
                options={d.tuitionTypeOptions}
                required
              />
              <GenderToggle
                name="tutorGenderPref"
                label="Tutor gender preference"
                value={f.tutorGenderPref}
                onChange={h.handleTutorGenderChange}
                options={["Male", "Female", "Any"]}
              />
            </div>
          </section>
          <section className="panel form-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">03 · THE DETAILS</span>
                <h2>A schedule that works for you.</h2>
              </div>
              <span className="icon-tile terra">
                <CalendarDays size={23} />
              </span>
            </div>
            <div className="form-grid">
              <SelectInput
                name="daysPerWeek"
                label="Days per week"
                value={f.daysPerWeek}
                onChange={h.handleInputChange}
                options={d.daysOptions}
                required
              />
              <TextInput
                name="tutoringTime"
                label="Preferred time"
                value={f.tutoringTime}
                onChange={h.handleInputChange}
                placeholder="e.g. 5 PM – 7 PM"
                required
                maxLength={20}
              />
              <TextInput
                name="startingDate"
                label="Preferred start date"
                value={f.startingDate}
                onChange={h.handleInputChange}
                type="date"
                required
              />
              <TextInput
                name="salary"
                label="Budget (BDT)"
                value={f.salary}
                onChange={h.handleInputChange}
                placeholder="e.g. 6000"
                type="number"
                required
                maxLength={6}
              />
              <SelectInput
                name="paymentType"
                label="Payment basis"
                value={f.paymentType}
                onChange={h.handleInputChange}
                options={d.paymentOptions}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="details">
                Anything else? <span className="muted">· optional</span>
              </label>
              <textarea
                id="details"
                name="details"
                value={f.details || ""}
                onChange={h.handleInputChange}
                rows={4}
                maxLength={500}
                placeholder="Learning goals, teaching preferences, or anything a tutor should know."
              />
              <span className="field-meta">
                {(f.details || "").length} / 500 characters
              </span>
            </div>
            <Notice error={message?.type === "error"}>{message?.text}</Notice>
            <div className="form-footer">
              <button
                type="button"
                className="button button-secondary"
                onClick={h.handleCancel}
              >
                Cancel
              </button>
              <button className="button button-primary" disabled={isLoading}>
                {isLoading ? "Posting your tuition…" : "Publish tuition"}
                <Send size={16} />
              </button>
            </div>
          </section>
        </form>
        <aside className="panel tip-panel form-guidance">
          <span className="eyebrow">
            <Lightbulb size={16} /> MAKE YOUR POST COUNT
          </span>
          <h3>
            Small details.
            <br />
            Stronger connections.
          </h3>
          <p>
            A clear tuition post helps educators decide whether they’re the
            right fit for your learner.
          </p>
          <ul className="guidance-list">
            <li>Choose the subjects you need help with.</li>
            <li>Include an accurate location and schedule.</li>
            <li>Set a realistic budget for your requirements.</li>
          </ul>
          <div className="draft-summary">
            <h4>Your tuition at a glance</h4>
            <p>
              <Check size={14} />
              {f.classCourse || "Choose a class"}
            </p>
            <p>
              <Check size={14} />
              {f.subjects.length ? f.subjects.join(", ") : "Add your subjects"}
            </p>
            <p>
              <Check size={14} />
              {f.city || "Select a city"}
              {f.location ? " · " + f.location : ""}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

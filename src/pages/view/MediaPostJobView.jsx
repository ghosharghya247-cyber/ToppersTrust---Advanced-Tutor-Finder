import {
  ArrowLeft,
  ArrowUpRight,
  ClipboardList,
  Lightbulb,
  Send,
} from "lucide-react";
import {
  EmptyState,
  LoadingState,
  Notice,
  PageHeading,
} from "../../components/ui/Primitives";
export default function MediaPostJobView({
  loading,
  submitting,
  error,
  successMessage,
  jobDescription,
  previousRequests = [],
  loadingRequests,
  onDescriptionChange,
  onSubmit,
  onBack,
}) {
  if (loading) return <LoadingState label="Preparing your request space…" />;
  const count = jobDescription.trim().length;
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="MAKE THE RIGHT CONNECTION"
        title="Request a tutor."
        description="Tell us what your learners need. Our team will help with the next step."
      >
        <button
          className="button button-secondary button-small"
          onClick={onBack}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </PageHeading>
      <Notice error>{error}</Notice>
      <Notice>{successMessage}</Notice>
      <div className="form-layout">
        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Your learning requirements</h2>
              <p>The little details make a big difference.</p>
            </div>
            <span className="icon-tile sage">
              <ClipboardList size={23} />
            </span>
          </div>
          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="job-description">
                What kind of tutor are you looking for?
              </label>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={onDescriptionChange}
                rows={9}
                minLength={10}
                maxLength={5000}
                required
                placeholder="Include subjects, class, location, schedule, budget, and any learning preferences…"
                aria-describedby="request-help"
              />
              <div className="field-meta" id="request-help">
                <span>At least 10 characters. Be as specific as you can.</span>
                <span>{jobDescription.length.toLocaleString()} / 5,000</span>
              </div>
            </div>
            <div className="form-footer">
              <p className="muted">
                Your request will be shared with the admin team.
              </p>
              <button
                className="button button-primary"
                disabled={
                  submitting || count < 10 || jobDescription.length > 5000
                }
              >
                {submitting ? "Sending request…" : "Send tutor request"}
                <Send size={16} />
              </button>
            </div>
          </form>
        </section>
        <aside className="panel tip-panel">
          <span className="eyebrow">
            <Lightbulb size={16} /> A STRONG REQUEST INCLUDES
          </span>
          <h3>
            Clarity now.
            <br />
            Better matches later.
          </h3>
          <ul className="guidance-list">
            <li>Student’s class and subjects</li>
            <li>Area and preferred tuition type</li>
            <li>Days per week and available times</li>
            <li>Expected budget and start date</li>
            <li>Any specific teaching preferences</li>
          </ul>
        </aside>
      </div>
      <section className="panel request-history">
        <div className="section-heading">
          <div>
            <h2>Your previous requests</h2>
            <p>A record of the connections you’ve started.</p>
          </div>
          <span className="badge">{previousRequests.length} requests</span>
        </div>
        {loadingRequests ? (
          <LoadingState label="Loading requests…" />
        ) : previousRequests.length ? (
          previousRequests.map((request) => (
            <details className="history-item" key={request.id}>
              <summary>
                <span>
                  <strong>Request #{request.id}</strong>
                  <small>
                    {request.created_at
                      ? new Date(request.created_at).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "short", day: "numeric" },
                        )
                      : "Date unavailable"}
                  </small>
                </span>
                <ArrowUpRight size={18} />
              </summary>
              <p>{request.job_description}</p>
            </details>
          ))
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="Your first connection starts here"
            description="Once you send a request, you can revisit its requirements here."
          />
        )}
      </section>
    </div>
  );
}

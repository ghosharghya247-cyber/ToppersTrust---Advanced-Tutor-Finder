import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  MessageSquare,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { supabase } from "../../supabase";
import { formatDate } from "../model/PreviousJobModel";
import {
  EmptyState,
  LoadingState,
  Notice,
  PageHeading,
} from "../../components/ui/Primitives";
import { InfoGrid } from "../../components/ui/ProfilePage";
import Modal from "../../components/ui/Modal";

function JobItem({
  job,
  feedbackState,
  onToggleFeedback,
  onFeedbackChange,
  onRatingChange,
  onSubmitFeedback,
  onDeleteJob,
}) {
  const feedback = feedbackState[job.id] || {};
  return (
    <article className="panel shortlist-job">
      <div className="section-heading">
        <div>
          <span className="eyebrow">TUITION #{job.code || job.id}</span>
          <h2>
            {job.title ||
              (job.medium || "Tuition") +
                " · " +
                (job.class || "Class not provided")}
          </h2>
        </div>
        {!job.assigned_tutor_user_id && (
          <button
            className="icon-button danger-action"
            aria-label={"Delete tuition " + (job.code || job.id)}
            onClick={() => onDeleteJob(job.id)}
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>
      <span className="badge">
        {job.assigned_tutor_name
          ? "Assigned to " + job.assigned_tutor_name
          : "Awaiting a tutor"}
      </span>
      <InfoGrid
        fields={[
          ["Subjects", job.subjects],
          ["Salary", job.salary ? "৳" + job.salary : null],
          ["Days per week", job.daysperweek],
          ["Students", job.numberofstudents],
          ["Location", [job.area, job.city].filter(Boolean).join(", ")],
          ["Street address", job.location],
          [
            "Payment basis",
            job.paymentbasis === "M" ? "Monthly" : job.paymentbasis,
          ],
          ["Tuition type", job.tuition_type],
          ["Posted", formatDate(job.posted_date)],
        ]}
      />
      {job.assigned_tutor_user_id && (
        <div className="feedback-section">
          {feedback.feedbackSubmitted ? (
            <Notice>Thank you. Your feedback has been submitted.</Notice>
          ) : !feedback.showInput ? (
            <button
              className="button button-secondary button-small"
              onClick={() => onToggleFeedback(job.id)}
            >
              <MessageSquare size={16} /> Leave feedback
            </button>
          ) : (
            <>
              <fieldset className="rating-field">
                <legend>How was your learning experience?</legend>
                <div className="rating-options">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <label key={star}>
                      <input
                        type="radio"
                        name={"rating-" + job.id}
                        value={star}
                        checked={feedback.rating === star}
                        onChange={() => onRatingChange(job.id, star)}
                      />
                      <Star
                        size={24}
                        fill={
                          star <= (feedback.rating || 0)
                            ? "currentColor"
                            : "none"
                        }
                      />
                      <span className="sr-only">
                        {star} {star === 1 ? "star" : "stars"}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="field">
                <label htmlFor={"feedback-" + job.id}>
                  Feedback or complaint · optional
                </label>
                <textarea
                  id={"feedback-" + job.id}
                  rows={3}
                  value={feedback.feedbackText || ""}
                  onChange={(e) => onFeedbackChange(job.id, e.target.value)}
                  placeholder="Share what went well or what could be better."
                />
              </div>
              <div className="dialog-actions">
                <button
                  className="button button-secondary button-small"
                  onClick={() => onToggleFeedback(job.id)}
                >
                  Cancel
                </button>
                <button
                  className="button button-primary button-small"
                  onClick={() => onSubmitFeedback(job.id)}
                >
                  Submit feedback
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </article>
  );
}
const PreviousJobView = () => {
  const navigate = useNavigate();
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackState, setFeedbackState] = useState({});
  const [currentAuthUser, setCurrentAuthUser] = useState(null);
  const [currentGuardianIntegerId, setCurrentGuardianIntegerId] =
    useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [jobToDeleteId, setJobToDeleteId] = useState(null);
  const [uiMessage, setUiMessage] = useState({ text: "", type: "" });
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (uiMessage.text) {
      const timer = setTimeout(() => {
        setUiMessage({ text: "", type: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [uiMessage]);

  useEffect(() => {
    const getCurrentUser = async () => {
      setLoading(true);
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) {
        setError("Could not fetch user session. Please log in again.");
        setLoading(false);
        navigate("/");
        return;
      }
      if (user) {
        setCurrentAuthUser(user);
      } else {
        setError("No user session. Please log in.");
        setLoading(false);
        navigate("/");
      }
    };
    getCurrentUser();
  }, [navigate]);

  useEffect(() => {
    if (!currentAuthUser) return;
    const fetchGuardianIntegerId = async () => {
      try {
        const { data: guardianProfile, error: profileError } = await supabase
          .from("guardian")
          .select("id")
          .eq("user_id", currentAuthUser.id)
          .single();
        if (profileError) {
          if (profileError.code === "PGRST116") {
            setError("Guardian profile not found. Cannot fetch posted jobs.");
          } else {
            throw profileError;
          }
          setLoading(false);
        } else if (guardianProfile) {
          setCurrentGuardianIntegerId(guardianProfile.id);
        } else {
          setError("Guardian profile data is missing.");
          setLoading(false);
        }
      } catch (err) {
        setError(`Failed to get guardian details: ${err.message}`);
        setLoading(false);
      }
    };
    fetchGuardianIntegerId();
  }, [currentAuthUser]);

  useEffect(() => {
    if (!currentGuardianIntegerId) {
      if (currentAuthUser && !loading && !error) setLoading(false);
      if (!loading && !currentAuthUser) setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data: jobsData, error: jobsError } = await supabase
          .from("job")
          .select("*")
          .eq("guardianid", currentGuardianIntegerId)
          .order("posted_date", { ascending: false });
        if (jobsError) throw jobsError;
        if (!jobsData || jobsData.length === 0) {
          setPostedJobs([]);
          setLoading(false);
          return;
        }
        const jobIds = jobsData.map((job) => job.id);
        const { data: acceptedJobs, error: acceptedJobsError } = await supabase
          .from("accepted_jobs")
          .select("job_id, tutor_id")
          .in("job_id", jobIds);
        if (acceptedJobsError) throw acceptedJobsError;
        const jobToTutorMap = acceptedJobs.reduce((map, item) => {
          map[item.job_id] = item.tutor_id;
          return map;
        }, {});
        const tutorIds = [
          ...new Set(
            acceptedJobs
              .map((item) => item.tutor_id)
              .filter((id) => id != null),
          ),
        ];
        let tutorIdToNameMap = {};
        if (tutorIds.length > 0) {
          const { data: tutorsData, error: tutorsError } = await supabase
            .from("tutor_card")
            .select("id, name")
            .in("id", tutorIds);
          if (tutorsError) throw tutorsError;
          tutorIdToNameMap = tutorsData.reduce((map, tutor) => {
            map[tutor.id] = tutor.name;
            return map;
          }, {});
        }
        const jobsWithTutorNames = jobsData.map((job) => {
          const tutorId = jobToTutorMap[job.id];
          const tutorName = tutorId ? tutorIdToNameMap[tutorId] : null;
          return {
            ...job,
            assigned_tutor_name: tutorName,
            assigned_tutor_user_id: tutorId || job.assigned_tutor_user_id,
          };
        });

        let submittedFeedbackJobIds = new Set();
        const jobsWithAssignedTutors = jobsWithTutorNames.filter(
          (job) => job.assigned_tutor_user_id,
        );
        const relevantJobIdsForComplaints = jobsWithAssignedTutors.map(
          (job) => job.id,
        );
        if (relevantJobIdsForComplaints.length > 0) {
          const { data: existingComplaints, error: complaintsError } =
            await supabase
              .from("complaint")
              .select("job_id")
              .eq("guardian_id", currentGuardianIntegerId)
              .in("job_id", relevantJobIdsForComplaints);
          if (!complaintsError && existingComplaints) {
            existingComplaints.forEach((c) =>
              submittedFeedbackJobIds.add(c.job_id),
            );
          }
        }
        const initialFeedbackState = {};
        jobsWithTutorNames.forEach((job) => {
          initialFeedbackState[job.id] = {
            showInput: false,
            feedbackText: "",
            rating: 0,
            feedbackSubmitted: submittedFeedbackJobIds.has(job.id),
          };
        });
        setFeedbackState(initialFeedbackState);
        setPostedJobs(jobsWithTutorNames);
      } catch (err) {
        setError(
          (prevError) =>
            prevError || `Failed to load your posted jobs: ${err.message}`,
        );
        setPostedJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [currentGuardianIntegerId]);

  const toggleFeedbackInput = useCallback((jobId) => {
    setFeedbackState((prev) => ({
      ...prev,
      [jobId]: {
        ...prev[jobId],
        showInput: !prev[jobId]?.showInput,
        feedbackText: !prev[jobId]?.showInput ? "" : prev[jobId]?.feedbackText,
        rating: !prev[jobId]?.showInput ? 0 : prev[jobId]?.rating,
      },
    }));
  }, []);

  const handleFeedbackChange = useCallback((jobId, text) => {
    setFeedbackState((prev) => ({
      ...prev,
      [jobId]: { ...prev[jobId], feedbackText: text },
    }));
  }, []);

  const handleRatingChange = useCallback((jobId, newRating) => {
    setFeedbackState((prev) => ({
      ...prev,
      [jobId]: { ...prev[jobId], rating: newRating },
    }));
  }, []);

  const submitFeedback = async (jobId) => {
    if (!currentAuthUser || !currentGuardianIntegerId) {
      setUiMessage({
        text: "You must be logged in to submit feedback.",
        type: "error",
      });
      return;
    }
    const currentJob = postedJobs.find((job) => job.id === jobId);
    if (!currentJob || !currentJob.assigned_tutor_user_id) {
      setUiMessage({
        text: "Cannot submit feedback: Tutor not assigned.",
        type: "error",
      });
      return;
    }
    const currentFeedback = feedbackState[jobId];
    const feedbackText = currentFeedback?.feedbackText?.trim();
    const rating = currentFeedback?.rating;
    if (!rating || rating === 0) {
      setUiMessage({
        text: "Please select a star rating (1-5).",
        type: "error",
      });
      return;
    }
    const { data: existingComplaints, error: fetchError } = await supabase
      .from("complaint")
      .select("id")
      .eq("guardian_id", currentGuardianIntegerId)
      .eq("tutor_id", currentJob.assigned_tutor_user_id)
      .eq("job_id", jobId);
    if (fetchError) {
      setUiMessage({
        text: `Error checking feedback: ${fetchError.message}`,
        type: "error",
      });
      return;
    }
    if (existingComplaints && existingComplaints.length > 0) {
      setUiMessage({
        text: "You have already submitted feedback for this job.",
        type: "error",
      });
      setFeedbackState((prev) => ({
        ...prev,
        [jobId]: { ...prev[jobId], showInput: false, feedbackSubmitted: true },
      }));
      return;
    }
    try {
      const { error: insertError } = await supabase
        .from("complaint")
        .insert({
          guardian_id: currentGuardianIntegerId,
          tutor_id: currentJob.assigned_tutor_user_id,
          rating: rating,
          complaint_text: feedbackText || null,
          job_id: jobId,
        });
      if (insertError) throw insertError;
      setUiMessage({
        text: "Feedback submitted successfully!",
        type: "success",
      });
      setFeedbackState((prev) => ({
        ...prev,
        [jobId]: { ...prev[jobId], showInput: false, feedbackSubmitted: true },
      }));
    } catch (err) {
      setUiMessage({
        text: `Failed to submit feedback: ${err.message}`,
        type: "error",
      });
    }
  };

  const handleDeleteJob = (jobId) => {
    setJobToDeleteId(jobId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDeleteId || deleting) return;
    setDeleting(true);
    try {
      const { error: deleteError } = await supabase
        .from("job")
        .delete()
        .eq("id", jobToDeleteId)
        .eq("guardianid", currentGuardianIntegerId);
      if (deleteError) throw deleteError;
      setUiMessage({ text: "Job deleted successfully!", type: "success" });
      setPostedJobs((prevJobs) =>
        prevJobs.filter((job) => job.id !== jobToDeleteId),
      );
      setFeedbackState((prev) => {
        const newState = { ...prev };
        delete newState[jobToDeleteId];
        return newState;
      });
    } catch (err) {
      setUiMessage({
        text: `Failed to delete job: ${err.message}`,
        type: "error",
      });
    } finally {
      setShowDeleteConfirmModal(false);
      setJobToDeleteId(null);
      setDeleting(false);
    }
  };

  const cancelDeleteJob = () => {
    setShowDeleteConfirmModal(false);
    setJobToDeleteId(null);
  };

  const filtered = postedJobs.filter((job) =>
    [job.title, job.subjects, job.code, job.assigned_tutor_name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="EVERY CONNECTION, IN ONE PLACE"
        title="Your tuition posts."
        description="Track your learning requests and share feedback on your tutoring experience."
      >
        <Link
          className="button button-primary button-small"
          to="/guardian/post-job"
        >
          <Plus size={16} /> Post a tuition
        </Link>
      </PageHeading>
      <Notice error>{error}</Notice>
      <Notice error={uiMessage.type === "error"}>{uiMessage.text}</Notice>
      {loading ? (
        <LoadingState label="Opening your tuition history…" />
      ) : (
        <>
          <div className="filter-bar">
            <div className="field">
              <label htmlFor="history-search">Find a tuition</label>
              <div className="search-input">
                <Search size={18} />
                <input
                  type="search"
                  id="history-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search subjects, code, or tutor name…"
                />
              </div>
            </div>
            <span className="filter-count">{filtered.length} posts</span>
          </div>
          {filtered.length ? (
            <div className="shortlist-grid">
              {filtered.map((job) => (
                <JobItem
                  key={job.id}
                  job={job}
                  feedbackState={feedbackState}
                  onToggleFeedback={toggleFeedbackInput}
                  onFeedbackChange={handleFeedbackChange}
                  onRatingChange={handleRatingChange}
                  onSubmitFeedback={submitFeedback}
                  onDeleteJob={handleDeleteJob}
                />
              ))}
            </div>
          ) : (
            <section className="panel">
              <EmptyState
                icon={BookOpen}
                title={query ? "No matching posts" : "A fresh chapter awaits"}
                description={
                  query
                    ? "Try a different subject, tuition code, or name."
                    : "Your tuition posts will appear here once you share your learner’s requirements."
                }
              />
            </section>
          )}
        </>
      )}
      <Modal
        open={showDeleteConfirmModal}
        title="Delete this tuition?"
        onClose={() => {
          if (!deleting) cancelDeleteJob();
        }}
      >
        <p className="muted">
          This permanently removes the tuition post. This action cannot be
          undone.
        </p>
        <div className="dialog-actions">
          <button
            className="button button-secondary"
            onClick={cancelDeleteJob}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            className="button button-danger"
            onClick={confirmDeleteJob}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete tuition"}
          </button>
        </div>
      </Modal>
    </div>
  );
};
export default PreviousJobView;

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { supabase } from "../../supabase";
import {
  EmptyState,
  LoadingState,
  Notice,
  PageHeading,
} from "../../components/ui/Primitives";
import { InfoGrid } from "../../components/ui/ProfilePage";
import { TutorPreview } from "../../components/ui/Discovery";
import Modal from "../../components/ui/Modal";
const TutorCard = () => {
  const [status, setStatus] = useState({
    isLoading: true,
    error: null,
    message: "Initializing",
  });
  const [guardianId, setGuardianId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [appointedTutor, setAppointedTutor] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [query, setQuery] = useState("");
  const actionLock = useRef(false);

  useEffect(() => {
    const fetchGuardian = async () => {
      setStatus({ isLoading: true, error: null, message: "Authenticating" });
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("guardian")
          .select("id")
          .eq("user_id", user.id)
          .single();
        if (error)
          setStatus({
            isLoading: false,
            error: "Could not find your guardian profile.",
            message: "",
          });
        else if (data) setGuardianId(data.id);
        else
          setStatus({
            isLoading: false,
            error: "Guardian profile not found for the logged-in user.",
            message: "",
          });
      } else {
        setStatus({
          isLoading: false,
          error: "You must be logged in to view this page.",
          message: "",
        });
      }
    };
    fetchGuardian();
  }, []);

  useEffect(() => {
    if (!guardianId) return;

    const fetchJobsAndTheirStatus = async () => {
      setStatus({
        isLoading: true,
        error: null,
        message: "Fetching your jobs and statuses",
      });
      try {
        const { data: jobsData, error: jobsError } = await supabase
          .from("job")
          .select("*, apply_job(count), accepted_jobs(tutor_id)")
          .eq("guardianid", guardianId)
          .order("posted_date", { ascending: false });

        if (jobsError) throw jobsError;
        if (!jobsData) {
          setJobs([]);
          setStatus({ isLoading: false, error: null, message: "" });
          return;
        }

        const jobIds = jobsData.map((job) => job.id);
        let acceptedStatuses = {};

        if (jobIds.length > 0) {
          const { data: acceptedData, error: acceptedError } = await supabase
            .from("accepted_jobs")
            .select("job_id, tutor_id")
            .in("job_id", jobIds);

          if (acceptedError) {
            console.warn(
              "DEBUG: Could not fetch accepted statuses, proceeding without:",
              acceptedError,
            );
          } else if (acceptedData) {
            acceptedData.forEach((acc) => {
              if (acc.tutor_id) {
                acceptedStatuses[acc.job_id] = { tutor_id: acc.tutor_id };
              }
            });
          }
        }

        const combinedJobs = jobsData.map((job) => ({
          ...job,
          accepted_jobs: acceptedStatuses[job.id]
            ? [acceptedStatuses[job.id]]
            : [],
        }));

        setJobs(combinedJobs);
        setStatus({ isLoading: false, error: null, message: "" });
      } catch (error) {
        console.error("DEBUG (Initial Job Fetch Error):", error);
        setStatus({
          isLoading: false,
          error: `Failed to load job data. ${error.message}`,
          message: "",
        });
      }
    };

    if (!selectedJob) {
      fetchJobsAndTheirStatus();
    }
  }, [guardianId, selectedJob]);

  const fetchApplicantsForJob = async (job) => {
    setStatus({ isLoading: true, error: null, message: `Loading applicants` });
    setSelectedJob(job);
    try {
      const { data: applications, error: appError } = await supabase
        .from("apply_job")
        .select("tutor_id")
        .eq("job_id", job.id);
      if (appError) throw appError;
      if (applications.length === 0) {
        setApplicants([]);
      } else {
        const tutorIds = applications.map((app) => app.tutor_id);
        const { data: tutors, error: tutorError } = await supabase
          .from("tutor_card")
          .select("*")
          .in("id", tutorIds);
        if (tutorError) throw tutorError;

        const mappedTutors = (tutors || []).map((t) => {
          let imageUrl = null;
          if (t.photo) {
            const { data: publicUrlData } = supabase.storage
              .from("photo")
              .getPublicUrl(t.photo);
            imageUrl = publicUrlData.publicUrl;
          }
          return {
            id: t.id,
            name: t.name || "N/A",
            university: t.uni || "N/A",
            grade: t.uni_grade || "N/A",
            qualification: t.qualification || "N/A",
            rating: t.rating ? parseFloat(t.rating) : null,
            ssc_grade: t.ssc_grade,
            ssc_school: t.ssc_school,
            hsc_grade: t.hsc_grade,
            hsc_school: t.hsc_school,
            photo: imageUrl,
            experience_years: t.experience_years,
          };
        });

        setApplicants(mappedTutors);
      }
    } catch (error) {
      setStatus({
        isLoading: false,
        error: `Failed to fetch applicants. ${error.message}`,
        message: "",
      });
    } finally {
      setStatus((previous) => ({ ...previous, isLoading: false }));
    }
  };

  const handleAssignTutor = async (tutor) => {
    if (appointedTutor) return;

    setStatus({
      isLoading: true,
      error: null,
      message: `Assigning ${tutor.name}`,
    });
    const assignmentData = {
      job_id: selectedJob.id,
      guardian_id: guardianId,
      tutor_id: tutor.id,
    };
    const { error } = await supabase
      .from("accepted_jobs")
      .upsert(assignmentData, { onConflict: "job_id" });
    if (error) {
      setStatus({
        isLoading: false,
        error: `Failed to assign tutor. ${error.message}`,
        message: "",
      });
    } else {
      setAppointedTutor(tutor);
      setJobs((prevJobs) =>
        prevJobs.map((j) =>
          j.id === selectedJob.id
            ? { ...j, accepted_jobs: [{ tutor_id: tutor.id }] }
            : j,
        ),
      );
      setStatus({ isLoading: false, error: null, message: "" });
    }
  };

  const handleDeleteJob = async (jobId) => {
    const { error } = await supabase.from("job").delete().eq("id", jobId);
    if (error)
      setStatus({
        isLoading: false,
        error: "Failed to delete job: " + error.message,
        message: "",
      });
    else setJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId));
  };

  const handleReturnToJobList = () => {
    setSelectedJob(null);
    setApplicants([]);
    setAppointedTutor(null);
  };

  const confirmAction = async () => {
    if (!prompt || actionLock.current) return;
    actionLock.current = true;
    setConfirming(true);
    try {
      if (prompt.type === "delete") await handleDeleteJob(prompt.target.id);
      else await handleAssignTutor(prompt.target);
      setPrompt(null);
    } catch (error) {
      setStatus({ isLoading: false, error: error.message, message: "" });
    } finally {
      actionLock.current = false;
      setConfirming(false);
    }
  };
  const renderJobCard = (job, locked = false) => {
    const count = job.apply_job?.[0]?.count || 0;
    const filled = !!job.accepted_jobs?.[0]?.tutor_id;
    return (
      <article className="panel shortlist-job" key={job.id}>
        <div className="section-heading">
          <div>
            <span className="eyebrow">TUITION #{job.code || job.id}</span>
            <h2>{job.subjects || "Your tuition request"}</h2>
          </div>
          <span className="badge">
            {filled ? "Tutor appointed" : count + " applicants"}
          </span>
        </div>
        <InfoGrid
          fields={[
            ["Days per week", job.daysperweek],
            ["Salary", job.salary ? "৳" + job.salary : null],
            ["Students", job.numberofstudents],
            ["Tuition type", job.tuition_type],
            [
              "Posted",
              job.posted_date
                ? new Date(job.posted_date).toLocaleDateString()
                : null,
            ],
          ]}
        />
        {!locked && (
          <div className="form-footer">
            <button
              className="button button-primary"
              onClick={() => fetchApplicantsForJob(job)}
              disabled={filled}
            >
              {filled ? "Tutor appointed" : "Review applicants"}
              <ArrowRight size={16} />
            </button>
            {!filled && (
              <button
                className="icon-button danger-action"
                aria-label={"Delete tuition " + (job.code || job.id)}
                onClick={() => setPrompt({ type: "delete", target: job })}
              >
                <Trash2 size={17} />
              </button>
            )}
          </div>
        )}
      </article>
    );
  };
  const visibleJobs = jobs.filter((job) =>
    [job.code, job.subjects, job.tuition_type]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="GREAT CONNECTIONS, THOUGHTFULLY CHOSEN"
        title={selectedJob ? "Meet your applicants." : "Your tutor shortlist."}
        description={
          selectedJob
            ? "Compare educators and choose the guidance that fits your learner."
            : "Review the tutors who’ve expressed interest in your tuition posts."
        }
      >
        {selectedJob ? (
          <button
            className="button button-secondary button-small"
            onClick={handleReturnToJobList}
          >
            <ArrowLeft size={16} /> All tuitions
          </button>
        ) : (
          <Link
            className="button button-primary button-small"
            to="/guardian/post-job"
          >
            <Plus size={16} /> Post a tuition
          </Link>
        )}
      </PageHeading>
      <Notice error>{status.error}</Notice>
      {status.error && (
        <button
          className="button button-secondary button-small"
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
      )}
      {status.isLoading ? (
        <LoadingState label={status.message + "…"} />
      ) : selectedJob ? (
        <>
          {renderJobCard(selectedJob, true)}
          <div className="section-heading shortlist-heading">
            <h2>Educators ready to help</h2>
            <span className="badge">{applicants.length} applicants</span>
          </div>
          {applicants.length ? (
            <div className="educator-grid">
              {applicants.map((tutor) => (
                <TutorPreview
                  key={tutor.id}
                  tutor={{
                    ...tutor,
                    profileImageUrl: tutor.photo,
                    department: tutor.qualification,
                    sscInfo: [tutor.ssc_school, tutor.ssc_grade]
                      .filter(Boolean)
                      .join(" · "),
                    hscInfo: [tutor.hsc_school, tutor.hsc_grade]
                      .filter(Boolean)
                      .join(" · "),
                  }}
                  compact
                >
                  <button
                    className="button button-primary button-full"
                    disabled={!!appointedTutor}
                    onClick={() =>
                      setPrompt({ type: "appoint", target: tutor })
                    }
                  >
                    {appointedTutor?.id === tutor.id ? (
                      <>
                        <Check size={16} /> Appointed
                      </>
                    ) : appointedTutor ? (
                      "Selection complete"
                    ) : (
                      <>
                        Appoint tutor <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </TutorPreview>
              ))}
            </div>
          ) : (
            <section className="panel">
              <EmptyState
                icon={Users}
                title="Your next guide hasn’t applied yet"
                description="Applications will appear here when tutors express interest in this tuition."
              />
            </section>
          )}
          {appointedTutor && (
            <Notice>
              {appointedTutor.name} has been appointed to this tuition.
            </Notice>
          )}
        </>
      ) : (
        <>
          <div className="filter-bar">
            <div className="field">
              <label htmlFor="shortlist-search">Find a tuition post</label>
              <div className="search-input">
                <Search size={18} />
                <input
                  id="shortlist-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search subjects, code, or tuition type…"
                />
              </div>
            </div>
            <span className="filter-count">{visibleJobs.length} posts</span>
          </div>
          {visibleJobs.length ? (
            <div className="shortlist-grid">
              {visibleJobs.map((job) => renderJobCard(job))}
            </div>
          ) : (
            <section className="panel">
              <EmptyState
                icon={Bookmark}
                title={
                  query
                    ? "No matching posts"
                    : "A little guidance starts with a post"
                }
                description={
                  query
                    ? "Try a different subject or tuition code."
                    : "Share your learning requirements. You can review interested tutors here."
                }
              >
                {query ? (
                  <button
                    className="button button-secondary"
                    onClick={() => setQuery("")}
                  >
                    Clear search
                  </button>
                ) : (
                  <Link
                    className="button button-primary"
                    to="/guardian/post-job"
                  >
                    Post a tuition <Plus size={16} />
                  </Link>
                )}
              </EmptyState>
            </section>
          )}
        </>
      )}
      <Modal
        open={!!prompt}
        title={
          prompt?.type === "delete"
            ? "Delete this tuition?"
            : "Appoint your tutor?"
        }
        onClose={() => {
          if (!confirming) setPrompt(null);
        }}
      >
        <p className="muted">
          {prompt?.type === "delete"
            ? "This permanently removes the tuition post. This action cannot be undone."
            : "You’re choosing " +
              (prompt?.target?.name || "this tutor") +
              " for your learner. Confirm to record the appointment."}
        </p>
        <div className="dialog-actions">
          <button
            className="button button-secondary"
            onClick={() => setPrompt(null)}
            disabled={confirming}
          >
            Cancel
          </button>
          <button
            className={
              "button " +
              (prompt?.type === "delete" ? "button-danger" : "button-primary")
            }
            onClick={confirmAction}
            disabled={confirming}
          >
            {confirming
              ? "Saving…"
              : prompt?.type === "delete"
                ? "Delete tuition"
                : "Confirm appointment"}
          </button>
        </div>
      </Modal>
    </div>
  );
};
export default TutorCard;

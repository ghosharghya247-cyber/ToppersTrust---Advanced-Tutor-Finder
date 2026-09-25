import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RecommendedTutorsModel from "../model/RecommendedTutorsModel";
import RecommendedTutorsView from "../view/RecommendedTutorsView";

export default function RecommendedTutorsController() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const model = useMemo(() => new RecommendedTutorsModel(), []);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [guardianId, setGuardianId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const saving = useRef(false);
  const isBrowsePage = pathname === "/browse-tutors";
  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { user },
        } = await model.supabase.auth.getUser();
        if (!user) {
          if (active) {
            setTutors([]);
            setShowLoginPrompt(true);
          }
          return;
        }
        const id = await model.getCurrentGuardianDbId();
        const data = await model.fetchTutors(id, !isBrowsePage);
        if (active) {
          setGuardianId(id);
          setTutors(data);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [model, isBrowsePage]);
  async function confirm() {
    if (!selected || saving.current) return;
    if (!guardianId) {
      setError(
        "A guardian profile is required to select a tutor. Please complete your guardian profile.",
      );
      return;
    }
    saving.current = true;
    setSelecting(true);
    setError(null);
    try {
      await model.acceptTutor(guardianId, selected.id);
      setTutors((current) => current.filter((t) => t.id !== selected.id));
      setFeedback({
        type: "success",
        text: selected.name + " selected. Your interest has been recorded.",
      });
      setSelected(null);
    } catch (err) {
      setError("Could not save your selection. " + err.message);
    } finally {
      saving.current = false;
      setSelecting(false);
    }
  }
  return (
    <RecommendedTutorsView
      tutors={tutors}
      loading={loading}
      error={error}
      isBrowsePage={isBrowsePage}
      showLoginPrompt={showLoginPrompt}
      onDismissLogin={() => setShowLoginPrompt(false)}
      handleLoginRedirect={() => navigate("/login")}
      onSelectTutor={(t) => {
        setError(null);
        setSelected(t);
      }}
      showAcceptConfirmModal={!!selected}
      tutorToConfirm={selected}
      selecting={selecting}
      confirmAcceptTutor={confirm}
      cancelAcceptTutor={() => {
        setSelected(null);
        setError(null);
      }}
      uiFeedbackMessage={feedback}
    />
  );
}

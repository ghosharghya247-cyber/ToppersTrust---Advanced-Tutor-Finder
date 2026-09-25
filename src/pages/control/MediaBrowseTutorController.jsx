import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase.js";
import { MediaBrowseTutorModel } from "../model/MediaBrowseTutorModel";

export const useMediaBrowseTutorController = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [unfilteredTutors, setUnfilteredTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [actionPending, setActionPending] = useState(false);
  const actionLock = useRef(false);
  const [swipeFeedback, setSwipeFeedback] = useState(null);
  const [acceptedTutorId, setAcceptedTutorId] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMediaId, setCurrentMediaId] = useState(null);
  const [filters, setFilters] = useState({ location: "", gender: "any" });

  const rightSwipeSoundRef = useRef(new Audio("/Right Swipe Sound.mp3"));
  const childRefs = useMemo(
    () =>
      Array(tutors.length)
        .fill(0)
        .map(() => React.createRef()),
    [tutors.length],
  );

  // Initialize Media and Tutors
  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        let mId = null;
        if (user) {
          mId = await MediaBrowseTutorModel.fetchMediaProfile(user.id);
          setCurrentMediaId(mId);
        }

        if (!mId) {
          setError("Media profile not found. Please complete your profile.");
          setLoading(false);
          return;
        }

        // Fetch all tutors
        const rawTutors = await MediaBrowseTutorModel.fetchTutors();

        // Get already accepted tutors
        const acceptedTutorIds =
          await MediaBrowseTutorModel.getAcceptedTutorIds(mId);

        // Filter out already accepted tutors
        const availableTutors = rawTutors.filter(
          (tutor) => !acceptedTutorIds.includes(tutor.id),
        );

        setUnfilteredTutors(processTutorData(availableTutors));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Filter Logic
  useEffect(() => {
    let filtered = [...unfilteredTutors];
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          (t.city && t.city.toLowerCase().includes(locationLower)) ||
          (t.address && t.address.toLowerCase().includes(locationLower)) ||
          (t.fulladdress &&
            t.fulladdress.toLowerCase().includes(locationLower)),
      );
    }
    if (filters.gender !== "any") {
      filtered = filtered.filter(
        (t) =>
          t.gender && t.gender.toLowerCase() === filters.gender.toLowerCase(),
      );
    }
    setTutors(filtered);
    setCurrentIndex(filtered.length - 1);
  }, [unfilteredTutors, filters]);

  const handleSwipe = async (direction, tutor, index) => {
    if (actionLock.current) {
      await childRefs[index]?.current?.restoreCard();
      return;
    }
    if (direction === "left") {
      setCurrentIndex(index - 1);
      return;
    }
    actionLock.current = true;
    setActionPending(true);
    setActionMessage(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setShowLoginPrompt(true);
        await childRefs[index]?.current?.restoreCard();
        return;
      }
      if (!currentMediaId)
        throw new Error(
          "Please complete your partner profile before continuing.",
        );
      const { error: saveError } = await MediaBrowseTutorModel.acceptTutor(
        currentMediaId,
        tutor.id,
      );
      if (saveError) throw saveError;
      setCurrentIndex(index - 1);
      setUnfilteredTutors((items) =>
        items.filter((item) => item.id !== tutor.id),
      );
      setActionMessage({ type: "success", text: "Tutor selected." });
    } catch (error) {
      setActionMessage({
        type: "error",
        text: error.message || "Could not save. Please try again.",
      });
      await childRefs[index]?.current?.restoreCard();
    } finally {
      actionLock.current = false;
      setActionPending(false);
    }
  };

  return {
    tutors,
    loading,
    error,
    swipeFeedback,
    acceptedTutorId,
    showLoginPrompt,
    currentIndex,
    filters,
    setFilters,
    childRefs,
    setShowLoginPrompt,
    actionMessage,
    actionPending,
    handleSwipe,
    navigate,
    manualSwipe: (dir) => {
      if (!actionLock.current) childRefs[currentIndex]?.current?.swipe(dir);
    },
  };
};

// Helper to map DB data to UI needs
const processTutorData = (data) =>
  data.map((tutor) => ({
    ...tutor,
    displayName: tutor.name || "Unknown Tutor",
    location: tutor.city || tutor.address || "Not Specified",
    photoUrl: tutor.photo
      ? supabase.storage.from("photo").getPublicUrl(tutor.photo).data.publicUrl
      : null,
  }));

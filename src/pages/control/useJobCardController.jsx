import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase.js";
import { JobModel } from "../model/JobModel";

export const useJobCardController = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [unfilteredJobs, setUnfilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [actionPending, setActionPending] = useState(false);
  const actionLock = useRef(false);
  const [swipeFeedback, setSwipeFeedback] = useState(null);
  const [appliedJobId, setAppliedJobId] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTutorId, setCurrentTutorId] = useState(null);
  const [filters, setFilters] = useState({ location: "", gender: "any" });

  const rightSwipeSoundRef = useRef(new Audio("/Right Swipe Sound.mp3"));
  const childRefs = useMemo(
    () =>
      Array(jobs.length)
        .fill(0)
        .map(() => React.createRef()),
    [jobs.length],
  );

  // Initialize Tutor and Jobs
  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        let tId = null;
        if (user) {
          tId = await JobModel.fetchTutorProfile(user.id);
          setCurrentTutorId(tId);
        }
        const rawJobs = await JobModel.fetchJobs(tId);
        setUnfilteredJobs(processJobData(rawJobs));
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
    let filtered = [...unfilteredJobs];
    if (filters.location) {
      filtered = filtered.filter((j) =>
        j.location.toLowerCase().includes(filters.location.toLowerCase()),
      );
    }
    if (filters.gender !== "any") {
      filtered = filtered.filter(
        (j) =>
          String(j.preferredTutor || "").toLowerCase() ===
          filters.gender.toLowerCase(),
      );
    }
    setJobs(filtered);
    setCurrentIndex(filtered.length - 1);
  }, [unfilteredJobs, filters]);

  const handleSwipe = async (direction, job, index) => {
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
      if (!currentTutorId)
        throw new Error(
          "Please complete your tutor profile before continuing.",
        );
      const { error: saveError } = await JobModel.applyForJob(
        job.id,
        currentTutorId,
      );
      if (saveError) throw saveError;
      setCurrentIndex(index - 1);
      setUnfilteredJobs((items) => items.filter((item) => item.id !== job.id));
      setActionMessage({ type: "success", text: "Application submitted." });
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
    jobs,
    loading,
    error,
    swipeFeedback,
    appliedJobId,
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
const processJobData = (data) =>
  data.map((job) => ({
    ...job, // Keeps original fields
    // Map DB snake_case to UI camelCase
    postedDate: job.posted_date,
    daysPerWeek: job.daysperweek,
    noOfStudents: job.numberofstudents,
    tutoringTime: job.time, // DB column is 'time'
    studentGender: job.studentgender,
    preferredTutor: job.genderpreference,
    tuitionType: job.tuition_type,
    paymentBasis: job.paymentbasis === "M" ? "Monthly" : job.paymentbasis,

    // Custom logic
    title: `${job.medium || "N/A"} tutor for ${job.class || "N/A"} student`,
    location: job.area || job.location || "Not Specified",
    subjects: job.subjects ? job.subjects.split(",").map((s) => s.trim()) : [],
    logoUrl: "/previewremovebgpreview-1@2x.png",
  }));

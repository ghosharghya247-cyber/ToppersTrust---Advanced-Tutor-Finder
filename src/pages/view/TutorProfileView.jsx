import ProfilePage, {
  InfoGrid,
  ProfileLink,
  ProfileSection,
} from "../../components/ui/ProfilePage";
import { LoadingState } from "../../components/ui/Primitives";
export default function TutorProfileView({
  tutorData = {},
  loading,
  error,
  handleGoBack,
}) {
  const t = tutorData;
  if (loading) return <LoadingState label="Opening your teaching profile…" />;
  return (
    <ProfilePage data={t} role="tutor" error={error} onBack={handleGoBack}>
      <ProfileSection
        title="Teaching preferences"
        description="Your expertise, availability, and ideal learning environment."
      >
        <InfoGrid
          fields={[
            ["Tutoring method", t.tutoringMethod],
            ["Experience", t.totalExperience],
            ["Available days", t.availableDays],
            ["Available time", t.availableTime],
            ["Current location", t.location],
            [
              "Expected salary",
              t.expectedSalary ? "৳" + t.expectedSalary : "Not provided",
            ],
            ["Preferred locations", t.preferredLocations],
            ["Place of tutoring", t.placeOfTutoring],
            ["Preferred classes", t.preferredClasses],
            ["Preferred subjects", t.preferredSubjects],
            ["Tutoring style", t.tutoringStyle],
          ]}
        />
      </ProfileSection>
      <ProfileSection
        title="Education"
        description="The foundations of your teaching journey."
      >
        {t.uniSchool || t.uniExamDegree || t.uniGrade ? (
          <div className="education-entry">
            <span className="eyebrow">UNIVERSITY / HIGHER EDUCATION</span>
            <h3>{t.uniSchool || "University details"}</h3>
            <InfoGrid
              fields={[
                ["Curriculum", t.uniCurriculum],
                ["Exam / degree", t.uniExamDegree],
                ["Major / group", t.uniMajorGroup],
                ["Result", t.uniGrade],
                ["From", t.uniFromDate],
                ["To", t.uniToDate],
                ["Student ID", t.uniIdCardNo],
                ["Year of passing", t.uniYearOfPassing],
                ["Currently studying", t.uniCurrentlyStudying ? "Yes" : "No"],
              ]}
            />
          </div>
        ) : (
          <p className="muted">
            Add your university details by editing your profile.
          </p>
        )}
        <div className="education-entry">
          <span className="eyebrow">HIGHER SECONDARY · HSC</span>
          <InfoGrid
            fields={[
              ["Institute", t.hscSchool],
              ["Result", t.hscGrade],
            ]}
          />
        </div>
        <div className="education-entry">
          <span className="eyebrow">SECONDARY · SSC</span>
          <InfoGrid
            fields={[
              ["Institute", t.sscSchool],
              ["Result", t.sscGrade],
            ]}
          />
        </div>
      </ProfileSection>
      <ProfileSection
        title="Personal information"
        description="Contact details and supporting information."
        open={false}
      >
        <InfoGrid
          fields={[
            ["Email", t.email],
            ["Phone number", t.additionalNumber],
            ["Gender", t.gender],
            ["Date of birth", t.dateOfBirth],
            ["Religion", t.religion],
            ["National ID", t.nationalId],
            ["Nationality", t.nationality],
            [
              "Facebook",
              <ProfileLink value={t.facebookProfile} label="View profile" />,
            ],
            [
              "Documents",
              <ProfileLink value={t.driveLink} label="View documents" />,
            ],
            ["Father’s name", t.fathersName],
            ["Father’s number", t.fathersNumber],
            ["Mother’s name", t.mothersName],
            ["Mother’s number", t.mothersNumber],
            ["Emergency contact", t.emergencyContact],
          ]}
        />
      </ProfileSection>
    </ProfilePage>
  );
}

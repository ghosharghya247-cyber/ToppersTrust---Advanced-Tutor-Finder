import {
  Avatar,
  LoadingState,
  PageHeading,
} from "../../components/ui/Primitives";
// MediaProfileEditView.jsx - Edit Form for Media Profile
import React, { useState } from "react";
import {
  FaSave,
  FaTimes,
  FaUpload,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";

const MediaProfileEditView = ({
  profileData,
  loading,
  error,
  profileImageUrl,
  profileCompletion,
  isSaving,
  onUpdateProfile,
  onCancel,
}) => {
  // Local state for form fields
  const [formData, setFormData] = useState(
    profileData || {
      name: "",
      contactNumber: "",
      email: "",
      facebookProfile: "",
      city: "",
      address: "",
      profileImageUrl: null,
    },
  );

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(profileImageUrl);

  // Update form data when profileData changes
  React.useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  React.useEffect(() => {
    if (profileImageUrl) {
      setImagePreview(profileImageUrl);
    }
  }, [profileImageUrl]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 512KB)
    if (file.size > 512 * 1024) {
      alert("Image size must be less than 512KB");
      return;
    }

    // Validate file type
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      alert("Only PNG, JPEG, and WebP images are allowed");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData, imageFile);
  };

  // Generate fallback image
  const profileImageFallback = formData.name
    ? `https://placehold.co/200x200/1769F5/FFF?text=${formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")}`
    : "https://placehold.co/200x200/1769F5/FFF?text=M";

  return (
    <div className="page-container profile-editor">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <PageHeading
          eyebrow="MAKE YOURSELF KNOWN"
          title="Edit your partner profile."
          description="A few thoughtful details make every connection a little easier."
        />

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="panel">
          {/* Profile Image Section */}
          <div className="editor-upload">
            <label
              htmlFor="profileImageInput"
              className="cursor-pointer group relative"
            >
              <Avatar
                name={formData.name || "Partner"}
                src={imagePreview}
                size="xlarge"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <FaUpload className="text-white text-2xl" />
              </div>
            </label>
            <input
              type="file"
              id="profileImageInput"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="upload-input"
              aria-label="Upload profile photo"
            />
            <p className="text-xs text-gray-500 mt-2">
              Click image to change (Max 512KB)
            </p>
          </div>

          {/* Personal Information */}
          <div className="mb-6">
            <div className="editor-section-heading">
              <FaInfoCircle />
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-name"
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-email"
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-contactNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-contactNumber"
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber || ""}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter contact number"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-city"
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your city"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="edit-address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit-address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your full address"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-facebookProfile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Facebook Profile (Optional)
                </label>
                <input
                  id="edit-facebookProfile"
                  type="url"
                  name="facebookProfile"
                  value={formData.facebookProfile || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://facebook.com/yourprofile"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MediaProfileEditView;

/**
 * Info Card Component
 */
const InfoCard = ({ icon: Icon, label, value, color = "text-gray-700" }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3">
      <Icon className={`${color} text-xl mt-0.5 flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
        <p className="text-sm text-gray-900 break-words">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  </div>
);

/**
 * Profile Completion Badge
 */
const ProfileCompletionBadge = ({ percentage }) => {
  const getColor = () => {
    if (percentage >= 80) return "bg-green-100 text-green-800 border-green-300";
    if (percentage >= 50)
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const getIcon = () => {
    if (percentage >= 80) return <FaCheckCircle className="text-green-600" />;
    return <FaExclamationTriangle className="text-yellow-600" />;
  };

  return (
    <div
      className={`${getColor()} border-2 rounded-lg p-4 flex items-center gap-3 mb-6`}
    >
      {getIcon()}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">Profile Completion</span>
          <span className="text-lg font-bold">{percentage}%</span>
        </div>
        <div className="w-full bg-white rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              percentage >= 80
                ? "bg-green-600"
                : percentage >= 50
                  ? "bg-yellow-600"
                  : "bg-red-600"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {percentage < 100 && (
          <p className="text-xs mt-2">
            Complete your profile to improve verification chances
          </p>
        )}
      </div>
    </div>
  );
};

// /**
//  * Main Guardian Profile View Component
//  */

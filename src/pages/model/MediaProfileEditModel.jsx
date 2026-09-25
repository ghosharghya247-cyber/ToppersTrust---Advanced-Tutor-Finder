import { supabase } from "../../supabase.js";

export const initialFormData = {
  name: "",
  contactNumber: "",
  email: "",
  facebookProfile: "",
  city: "",
  address: "",
  guardianId: "",
  profileImageUrl: null,
};

export class MediaProfileModel {
  static async fetchProfile(userId) {
    const { data, error } = await supabase
      .from("media")
      .select(
        "id, name, phone, email, facebook_profile_link, city, address, photo",
      )
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  static async getAuthenticatedUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error("Authentication error. Please log in again.");
    }
    return user;
  }

  static async uploadProfileImage(userId, file, oldImagePath) {
    const fileExt = file.name.split(".").pop();
    const newFileName = `${userId}/media-profile-${Date.now()}.${fileExt}`;

    if (oldImagePath && !oldImagePath.startsWith("http")) {
      await supabase.storage.from("photo").remove([oldImagePath]);
    }

    const { data, error } = await supabase.storage
      .from("photo")
      .upload(newFileName, file, { cacheControl: "3600", upsert: true });

    if (error) throw error;
    return data.path;
  }

  static async updateProfile(userId, updates) {
    const { data: existingProfile, error: lookupError } = await supabase
      .from("media")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (lookupError && lookupError.code !== "PGRST116") throw lookupError;

    const query = existingProfile
      ? supabase.from("media").update(updates).eq("user_id", userId)
      : supabase.from("media").insert([{ user_id: userId, ...updates }]);

    const { data, error } = await query.select().single();
    if (error) throw error;
    return data;
  }

  static getPublicImageUrl(imagePath) {
    if (!imagePath || imagePath.startsWith("http")) return imagePath;
    const { data } = supabase.storage.from("photo").getPublicUrl(imagePath);
    return data?.publicUrl || imagePath;
  }

  static transformToFormData(profileData, userEmail) {
    if (!profileData) {
      return { ...initialFormData, email: userEmail || "" };
    }

    return {
      ...initialFormData,
      name: profileData.name || "",
      contactNumber: profileData.phone || "",
      email: profileData.email || userEmail || "",
      facebookProfile: profileData.facebook_profile_link || "",
      city: profileData.city || "",
      address: profileData.address || "",
      guardianId: profileData.id?.toString() || "",
      profileImageUrl: profileData.photo || null,
    };
  }

  static transformToDbUpdates(formData, imagePath) {
    return {
      name: formData.name || null,
      phone: formData.contactNumber || null,
      email: formData.email || null,
      facebook_profile_link: formData.facebookProfile || null,
      city: formData.city || null,
      address: formData.address || null,
      photo: imagePath || null,
    };
  }

  static calculateProfileCompletion(data) {
    const fields = [
      "name",
      "contactNumber",
      "email",
      "city",
      "address",
      "profileImageUrl",
    ];
    const completedFields = fields.filter((field) =>
      Boolean(data[field]),
    ).length;
    return Math.round((completedFields / fields.length) * 100);
  }
}

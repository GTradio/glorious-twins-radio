import { supabase } from "./client";

export const uploadImage = async (
  file: File,
  folder: "news" | "podcasts" | "programs" | "team"
): Promise<string> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from("radio-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("radio-images")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract path from URL
    const path = imageUrl.split("/radio-images/")[1];
    if (!path) return;

    const { error } = await supabase.storage
      .from("radio-images")
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
};

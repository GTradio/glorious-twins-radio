"use client";

import { uploadImage } from "@/lib/supabase/storage";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (url: string) => void;
  folder: "news" | "podcasts" | "programs" | "team";
  label?: string;
  required?: boolean;
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  folder,
  label = "Image",
  required = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
      const imageUrl = await uploadImage(file, folder);
      onImageChange(imageUrl);
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      setPreview(currentImage || null);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && "*"}
      </label>

      {preview ? (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden group">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-600"
        >
          {uploading ? (
            <>
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              <span className="text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-12 h-12" />
              <span className="text-sm font-medium">Click to upload image</span>
              <span className="text-xs">PNG, JPG, GIF up to 5MB</span>
            </>
          )}
        </button>
      )}

      <input
        title="Upload an image"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

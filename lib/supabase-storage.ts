import { createClient, SupabaseClient, Bucket } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials not found. Document storage functionality will be limited."
  );
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Document storage bucket name
export const DOCUMENTS_BUCKET = "hade-documents";
// Property images storage bucket name
export const PROPERTY_IMAGES_BUCKET = "hade-property-images";

// Initialize the storage buckets if they don't exist
export const initializeStorage = async (): Promise<boolean> => {
  try {
    const { data: bucketsResponse, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error("Error listing storage buckets:", listError.message);
      // If listing fails, we might not know if buckets exist.
      // Depending on Supabase behavior, createBucket might fail if it exists, or succeed (upsert-like).
      // Let's assume we should try to create them if listing fails.
    }

    const existingBuckets =
      bucketsResponse?.map((bucket: Bucket) => bucket.name) || [];

    const bucketsToEnsure = [
      { name: DOCUMENTS_BUCKET, public: false },
      { name: PROPERTY_IMAGES_BUCKET, public: true },
    ];

    for (const bucketConfig of bucketsToEnsure) {
      if (!existingBuckets.includes(bucketConfig.name)) {
        console.log(`Attempting to create bucket: ${bucketConfig.name}`);
        const { error: createError } = await supabase.storage.createBucket(
          bucketConfig.name,
          {
            public: bucketConfig.public,
          }
        );
        if (createError) {
          // Check for 'BucketAlreadyExists' or similar specific errors if possible, to avoid logging benign errors
          if (createError.message.includes("already exists")) {
            // Example error message check
            console.log(
              `Storage bucket '${bucketConfig.name}' already exists (confirmed by create attempt).`
            );
          } else {
            console.error(
              `Error creating storage bucket '${bucketConfig.name}':`,
              createError.message || createError
            );
          }
        } else {
          console.log(
            `Storage bucket '${bucketConfig.name}' created successfully.`
          );
        }
      } else {
        console.log(`Storage bucket '${bucketConfig.name}' already exists.`);
      }
    }

    return true;
  } catch (error: any) {
    console.error("Error initializing storage:", error.message || error);
    return false;
  }
};

// Upload a file to Supabase Storage
export const uploadFile = async (
  bucketName: string,
  file: File,
  path: string
  // onProgress?: (progress: number) => void // onProgress not directly supported by supabase-js v2 upload, consider custom XHR if needed
): Promise<{ url: string; fullPath: string; error: Error | null }> => {
  try {
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false, // Set to true if you want to overwrite files with the same path
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, fullPath: data.path, error: null };
  } catch (error: any) {
    console.error("Error uploading file:", error.message || error);
    return { url: "", fullPath: "", error: error as Error };
  }
};

// Delete a file from Supabase Storage
export const deleteFile = async (
  bucketName: string,
  path: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    // Note: 'path' should be the exact path to the file in the bucket.
    // If you stored a full URL, you'd need to extract the path first.
    const { error } = await supabase.storage.from(bucketName).remove([path]);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error deleting file:", error.message || error);
    return { success: false, error: error as Error };
  }
};

// Get a temporary signed URL for a file (useful for private buckets)
export const getFileUrl = async (
  bucketName: string,
  path: string,
  expiresIn: number = 3600
): Promise<{ url: string; error: Error | null }> => {
  try {
    const { data, error: signError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, expiresIn); // expiresIn in seconds

    if (signError) {
      throw signError;
    }

    return { url: data?.signedUrl ?? "", error: null };
  } catch (error: any) {
    console.error("Error getting file URL:", error.message || error);
    return { url: "", error: error as Error };
  }
};

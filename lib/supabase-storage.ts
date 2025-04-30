import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Document storage functionality will be limited.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Document storage bucket name
export const DOCUMENTS_BUCKET = 'hade-documents';

// Initialize the storage bucket if it doesn't exist
export const initializeStorage = async () => {
  try {
    // Check if the bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === DOCUMENTS_BUCKET);
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket(DOCUMENTS_BUCKET, {
        public: false, // Private bucket
      });
      
      if (error) {
        console.error('Error creating storage bucket:', error);
        return false;
      }
      
      console.log(`Storage bucket '${DOCUMENTS_BUCKET}' created successfully.`);
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return false;
  }
};

// Upload a file to Supabase Storage
export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; error: Error | null }> => {
  try {
    // Ensure the bucket exists
    await initializeStorage();
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(DOCUMENTS_BUCKET)
      .getPublicUrl(data.path);
    
    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { url: '', error: error as Error };
  }
};

// Delete a file from Supabase Storage
export const deleteFile = async (path: string): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .remove([path]);
    
    if (error) {
      throw error;
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error as Error };
  }
};

// Get a temporary URL for a file (for private files)
export const getFileUrl = async (path: string): Promise<{ url: string; error: Error | null }> => {
  try {
    const { data, error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(path, 60 * 60); // 1 hour expiry
    
    if (error) {
      throw error;
    }
    
    return { url: data.signedUrl, error: null };
  } catch (error) {
    console.error('Error getting file URL:', error);
    return { url: '', error: error as Error };
  }
};

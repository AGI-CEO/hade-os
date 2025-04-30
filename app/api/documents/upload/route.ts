import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { uploadFile } from "@/lib/supabase-storage";

// POST /api/documents/upload - Upload a document
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }
    
    // Generate a unique file name
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    
    // Create a path based on user type and ID
    const path = `${user.userType}/${user.id}/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { url, error } = await uploadFile(file, path);
    
    if (error) {
      return NextResponse.json(
        { message: "Failed to upload file", error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      fileUrl: url,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { message: "Failed to upload document" },
      { status: 500 }
    );
  }
}

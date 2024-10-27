import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/replicate";
import { jwtAuth } from "@/middleware/jwtAuth";
export const POST = jwtAuth(async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const file = await uploadFile(formData);
    return NextResponse.json(file);
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
});

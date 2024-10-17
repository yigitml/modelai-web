import { NextRequest, NextResponse } from "next/server";
import { createModel, getModelById } from "@/lib/replicate";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const model = await getModelById(id);
      if (model) {
        return NextResponse.json(model);
      } else {
        return NextResponse.json({ error: "Model not found" }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: "Missing model id" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const model = await createModel(data);
    return NextResponse.json(model);
  } catch (error) {
    console.error("Error creating model:", error);
    return NextResponse.json(
      { error: "Failed to create model" },
      { status: 500 },
    );
  }
}

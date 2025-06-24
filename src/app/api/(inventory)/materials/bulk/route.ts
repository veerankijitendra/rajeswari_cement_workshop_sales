import Material from "@/lib/models/inventory";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { materials } = body;

    if (!Array.isArray(materials) || materials.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty materials array" },
        { status: 400 }
      );
    }

    const insertedMaterials = await Material.insertMany(materials);

    return NextResponse.json({
      message: "Materials added successfully",
      data: insertedMaterials,
    });
  } catch (error) {
    console.error("Error in POST /api/inventory/materials/bulk:", error);
    return NextResponse.json({ error: "Failed to process request" });
  }
}

export async function DELETE() {
  try {

    const deletedMaterials = await Material.deleteMany({
    });

    return NextResponse.json({
      message: "Materials deleted successfully",
      data: deletedMaterials,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request", errors: JSON.stringify(error) });
  }
}

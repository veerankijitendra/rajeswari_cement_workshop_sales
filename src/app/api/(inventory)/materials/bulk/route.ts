import Material from "@/lib/models/inventory";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { materials } = body;


    if (!Array.isArray(materials) || materials.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty materials array" },
        { status: 400 }
      );
    }

    // Validate each material object
    // for (const material of materials) {
    //   if (!material.name || !material.quantity || !material.unitPrice) {
    //     return NextResponse.json(
    //       { error: "Each material must have name, quantity, and unitPrice" },
    //       { status: 400 }
    //     );
    //   }
    // }

    // Insert materials into the database
    const insertedMaterials = await Material.insertMany(materials);

    return NextResponse.json({
      message: "Materials added successfully",
      data: insertedMaterials,
    });
  } catch (error) {
    console.log("Error in POST /api/inventory/materials/bulk:", error);
    return NextResponse.json({ error: "Failed to process request" });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { ids } = body;

    // if (!Array.isArray(ids) || ids.length === 0) {
    //   return NextResponse.json(
    //     { error: "Invalid or empty ids array" },
    //     { status: 400 }
    //   );
    // }

    // Delete materials by IDs
    const deletedMaterials = await Material.deleteMany({
    //   _id: { $in: ids },
    });

    return NextResponse.json({
      message: "Materials deleted successfully",
      data: deletedMaterials,
    });
  } catch (error) {
    console.log("Error in DELETE /api/inventory/materials/bulk:", error);
    return NextResponse.json({ error: "Failed to process request" });
  }
}

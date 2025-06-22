import Sales from "@/lib/models/sales";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const data = request.json()
    await Sales.insertMany(data);
    return new NextResponse(
      JSON.stringify({ message: "Data created successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Error is occured while creating the sales", errors: JSON.stringify(error) }),
      {
        status: 500,
      }
    );
  }
}

export async function DELETE() {
  try {
    await Sales.deleteMany();
    return new NextResponse(
      JSON.stringify({ message: "Data deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Error is occured while deleting the sales",errors: JSON.stringify(error) }),
      {
        status: 500,
      }
    );
  }
}

import Sales from "@/lib/models/sales";
import { NextResponse } from "next/server";

const data = [
  {
    materialId: "685555242f4b8ce4e10a038d",
    price: 45,
    sellPrice: 60,
    quantity: 2,
  },
  {
    materialId: "685555242f4b8ce4e10a0394",
    price: 290,
    sellPrice: 350,
    quantity: 4,
  },
  {
    materialId: "685555242f4b8ce4e10a038d",
    price: 45,
    sellPrice: 60,
    quantity: 8,
  },
  {
    materialId: "685555242f4b8ce4e10a0398",
    price: 220,
    sellPrice: 270,
    quantity: 9,
  },
  {
    materialId: "685555242f4b8ce4e10a0397",
    price: 670,
    sellPrice: 750,
    quantity: 4,
  },
  {
    materialId: "685555242f4b8ce4e10a0396",
    price: 230,
    sellPrice: 280,
    quantity: 5,
  },
  {
    materialId: "685555242f4b8ce4e10a0396",
    price: 230,
    sellPrice: 280,
    quantity: 9,
  },
  {
    materialId: "685555242f4b8ce4e10a0394",
    price: 290,
    sellPrice: 350,
    quantity: 10,
  },
  {
    materialId: "685555242f4b8ce4e10a0391",
    price: 320,
    sellPrice: 400,
    quantity: 4,
  },
  {
    materialId: "685555242f4b8ce4e10a0397",
    price: 670,
    sellPrice: 750,
    quantity: 6,
  },
  {
    materialId: "685555242f4b8ce4e10a0393",
    price: 100,
    sellPrice: 130,
    quantity: 3,
  },
  {
    materialId: "685555242f4b8ce4e10a0394",
    price: 290,
    sellPrice: 350,
    quantity: 6,
  },
  {
    materialId: "685555242f4b8ce4e10a0399",
    price: 450,
    sellPrice: 500,
    quantity: 7,
  },
  {
    materialId: "685555242f4b8ce4e10a0391",
    price: 320,
    sellPrice: 400,
    quantity: 6,
  },
  {
    materialId: "685555242f4b8ce4e10a0397",
    price: 670,
    sellPrice: 750,
    quantity: 8,
  },
  {
    materialId: "685555242f4b8ce4e10a0397",
    price: 670,
    sellPrice: 750,
    quantity: 2,
  },
  {
    materialId: "685555242f4b8ce4e10a0397",
    price: 670,
    sellPrice: 750,
    quantity: 6,
  },
  {
    materialId: "685555242f4b8ce4e10a0396",
    price: 230,
    sellPrice: 280,
    quantity: 9,
  },
  {
    materialId: "685555242f4b8ce4e10a0393",
    price: 100,
    sellPrice: 130,
    quantity: 3,
  },
  {
    materialId: "685555242f4b8ce4e10a0395",
    price: 110,
    sellPrice: 140,
    quantity: 1,
  },
  {
    materialId: "685555242f4b8ce4e10a038d",
    price: 45,
    sellPrice: 60,
    quantity: 7,
  },
  {
    materialId: "685555242f4b8ce4e10a038d",
    price: 45,
    sellPrice: 60,
    quantity: 2,
  },
  {
    materialId: "685555242f4b8ce4e10a0391",
    price: 320,
    sellPrice: 400,
    quantity: 9,
  },
  {
    materialId: "685555242f4b8ce4e10a0392",
    price: 60,
    sellPrice: 80,
    quantity: 6,
  },
  {
    materialId: "685555242f4b8ce4e10a0394",
    price: 290,
    sellPrice: 350,
    quantity: 6,
  },
  {
    materialId: "685555242f4b8ce4e10a0397",
    price: 670,
    sellPrice: 750,
    quantity: 10,
  },
  {
    materialId: "685555242f4b8ce4e10a0399",
    price: 450,
    sellPrice: 500,
    quantity: 10,
  },
  {
    materialId: "685555242f4b8ce4e10a0396",
    price: 230,
    sellPrice: 280,
    quantity: 1,
  },
  {
    materialId: "685555242f4b8ce4e10a038d",
    price: 45,
    sellPrice: 60,
    quantity: 8,
  },
  {
    materialId: "685555242f4b8ce4e10a0393",
    price: 100,
    sellPrice: 130,
    quantity: 3,
  },
  {
    materialId: "685555242f4b8ce4e10a0398",
    price: 220,
    sellPrice: 270,
    quantity: 7,
  },
  {
    materialId: "685555242f4b8ce4e10a038d",
    price: 45,
    sellPrice: 60,
    quantity: 2,
  },
  {
    materialId: "685555242f4b8ce4e10a0393",
    price: 100,
    sellPrice: 130,
    quantity: 6,
  },
  {
    materialId: "685555242f4b8ce4e10a0391",
    price: 320,
    sellPrice: 400,
    quantity: 1,
  },
  {
    materialId: "685555242f4b8ce4e10a0396",
    price: 230,
    sellPrice: 280,
    quantity: 6,
  },
  {
    materialId: "685555242f4b8ce4e10a038d",
    price: 45,
    sellPrice: 60,
    quantity: 10,
  },
  {
    materialId: "685555242f4b8ce4e10a0395",
    price: 110,
    sellPrice: 140,
    quantity: 7,
  },
  {
    materialId: "685555242f4b8ce4e10a0392",
    price: 60,
    sellPrice: 80,
    quantity: 8,
  },
  {
    materialId: "685555242f4b8ce4e10a0397",
    price: 670,
    sellPrice: 750,
    quantity: 1,
  },
  {
    materialId: "685555242f4b8ce4e10a0397",
    price: 670,
    sellPrice: 750,
    quantity: 8,
  },
  {
    materialId: "685555242f4b8ce4e10a0395",
    price: 110,
    sellPrice: 140,
    quantity: 8,
  },
  {
    materialId: "685555242f4b8ce4e10a0394",
    price: 290,
    sellPrice: 350,
    quantity: 9,
  },
  {
    materialId: "685555242f4b8ce4e10a0395",
    price: 110,
    sellPrice: 140,
    quantity: 1,
  },
  {
    materialId: "685555242f4b8ce4e10a0394",
    price: 290,
    sellPrice: 350,
    quantity: 10,
  },
  {
    materialId: "685555242f4b8ce4e10a0392",
    price: 60,
    sellPrice: 80,
    quantity: 9,
  },
  {
    materialId: "685555242f4b8ce4e10a0395",
    price: 110,
    sellPrice: 140,
    quantity: 10,
  },
  {
    materialId: "685555242f4b8ce4e10a0391",
    price: 320,
    sellPrice: 400,
    quantity: 3,
  },
  {
    materialId: "685555242f4b8ce4e10a0399",
    price: 450,
    sellPrice: 500,
    quantity: 5,
  },
  {
    materialId: "685555242f4b8ce4e10a0393",
    price: 100,
    sellPrice: 130,
    quantity: 1,
  },
  {
    materialId: "685555242f4b8ce4e10a0392",
    price: 60,
    sellPrice: 80,
    quantity: 6,
  },
];

export async function POST(request: Request) {
  try {
    await Sales.insertMany(data);
    return new NextResponse(
      JSON.stringify({ message: "Data created successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Error is occured while creating the sales" }),
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await Sales.deleteMany();
    return new NextResponse(
      JSON.stringify({ message: "Data deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Error is occured while deleting the sales" }),
      {
        status: 500,
      }
    );
  }
}

import Sales from "@/lib/models/sales";
import Material from "@/lib/models/inventory";
import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongoose";
import { TSalesInput, TSalesResponse } from "@/lib/types";
import {salesSchema} from "@/lib/resource"

export const GET = async (request: Request) => {
  try {
    await connectToDB();
    if (
      !Sales.db ||
      !Sales.db.readyState 
    ) {
      throw new Error("Database connection is not established");
    }

    const { searchParams} = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("perPage") || "10", 10);



    const sales = await Sales.aggregate([
      {
        $facet: {
          data: [
            {
              $sort: { createdAt: 1 },
            },
            {
              $lookup: {
                from: "materials",
                localField: "materialId",
                foreignField: "_id",
                as: "material",
              },
            },
            {
              $unwind: "$material",
            },
            {
              $project: {
                _id: 0,
                // materialId: "$_id",
                price: 1,
                quantity: 1,
                sellPrice: 1,
                createdAt: 1,
                id: "$_id",
                materialName: "$material.materialName",
              },
            },
            {
                $skip: (page - 1) * perPage,
            },
            {
              $limit: perPage,
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const totalCount = sales[0]?.totalCount[0]?.count || 0;

    const data: TSalesResponse = {
      data: sales[0].data || [],
      page,
      perPage,
      totalCount,
      totalPages: Math.ceil(totalCount / perPage),
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sales data", errors: JSON.stringify(error) },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
    try {
        await connectToDB()
        if (!Sales.db || !Sales.db.readyState  || !Material.db || !Material.db.readyState) {
            throw new Error("Database connection is not established");
        }

        const body = await request.json();
        const parsedBody = salesSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(
                { error: parsedBody.error },
                { status: 400 }
            );
        }

        const { materialId, price, quantity, sellPrice } = parsedBody.data as TSalesInput;

        const material = await Material.findById(materialId);
        if (!material) {
            return NextResponse.json(
                { error: "Material not found" },
                { status: 404 }
            );
        }

        if (material.stock < quantity) {
            return NextResponse.json(
                { error: "Insufficient stock" },
                { status: 400 }
            );
        }

        material.stock = Number(material.stock) - Number(quantity);
        await material.save();

        const sale = new Sales({
            materialId,
            price,
            quantity,
            sellPrice,
        });
        await sale.save();

        return NextResponse.json(
            { message: "Sale created successfully", sale },
            { status: 201 }
        );

    }catch(error) {
        console.error("Error creating sales:", error);
        return NextResponse.json(
          { error: "Failed to create sales" },
          { status: 500 }
        );
    }
}

export const PUT = async (request: Request) => {
  try {
    const body = await request.json();
    const parsedBody = salesSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error },
        { status: 400 }
      );
    }

    const { materialId, price, quantity, sellPrice } = parsedBody.data as TSalesInput;

    await connectToDB();
    if (!Sales.db || !Sales.db.readyState) {
      throw new Error("Database connection is not established");
    }

    const sale = await Sales.findOneAndUpdate(
      { materialId },
      { price, quantity, sellPrice },
      { new: true }
    );

    if (!sale) {
      return NextResponse.json(
        { error: "Sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Sale updated successfully", sale },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating sale:", error);
    return NextResponse.json(
      { error: "Failed to update sale" },
      { status: 500 }
    );
  }
}


export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const salesId = searchParams.get("id");

    if (!salesId) {
      return NextResponse.json(
        { error: "Sales ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();
    if (!Sales.db || !Sales.db.readyState) {
      throw new Error("Database connection is not established");
    }

    const sale = await Sales.findOneAndDelete({ _id: salesId });

    if (!sale) {
      return NextResponse.json(
        { error: "Sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Sale deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting sale:", error);
    return NextResponse.json(
      { error: "Failed to delete sale" },
      { status: 500 }
    );
  }
}

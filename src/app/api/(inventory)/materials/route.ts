import Material from "@/lib/models/inventory";
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongoose";
import { materialSchema, MaterailEnum, SearchParamsEnum } from "@/lib/resource";
import { TMaterialResponse } from "@/lib/types";

export const GET = async (req: Request) => {
  try {
    await connectToDB();
    if (!Material.db || !Material.db.readyState) {
      throw new Error("Database connection is not established");
    }

    const { searchParams } = new URL(req.url);


    const search = searchParams.get(SearchParamsEnum.SEARCH) ?? "";
    const category = searchParams.getAll(SearchParamsEnum.CATEGORY);

    const categoryArray = Array.isArray(category) ? category : category ? [category] : []

    const page = parseInt(searchParams.get(SearchParamsEnum.PAGE) || "1", 10);
    const perPage = parseInt(searchParams.get(SearchParamsEnum.PER_PAGE) || "10", 10);

    const andConditions = []

    if(search) {
      andConditions.push({
                  $or: [
                    {
                      [MaterailEnum.CATEGORY]: {
                        $regex: search,
                        $options: "i",
                      },
                    },
                    {
                      [MaterailEnum.MATERIAL_NAME]: {
                        $regex: search,
                        $options: "i",
                      },
                    },
                  ],
                },)
    }

    if(categoryArray.length > 0) {
      andConditions.push({
         [MaterailEnum.CATEGORY]: { $in: categoryArray } 
      })
    }

    const match: any = {
      $match: andConditions.length > 0 ? {$and: andConditions}: {}
    };

    const materials = await Material.aggregate([
        match,
      {
        $facet: {
          data: [
            { $sort: { createdAt: 1 } },
            {
              $project: {
                _id: 0,
                [MaterailEnum.ID]: "$_id",
                [MaterailEnum.MATERIAL_NAME]: 1,
                [MaterailEnum.PRICE]: 1,
                [MaterailEnum.SELL_PRICE]: 1,
                [MaterailEnum.STOCK]: 1,
                [MaterailEnum.STOCK_UNITS]: 1,
                [MaterailEnum.CATEGORY]: 1,
                [MaterailEnum.TOTAL_PRICE]: {$multiply: [`$${MaterailEnum.PRICE}`, `$${MaterailEnum.STOCK}`]}
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

    const data: TMaterialResponse = {
      data: materials[0].data,
      page,
      perPage,
      totalCount:
        materials[0].totalCount.length > 0
          ? materials[0].totalCount[0].count
          : 0,

      totalPages: Math.ceil(
        (materials[0].totalCount.length > 0
          ? materials[0].totalCount[0].count
          : 0) / perPage
      ),
    };

    if (!materials || materials.length === 0) {
      data.data = [];
      data.totalCount = 0;
    }

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching materials:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch materials" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsedBody = materialSchema.safeParse(body);

    if (!parsedBody.success) {
      return new NextResponse(JSON.stringify({ error: parsedBody.error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    await connectToDB();
    if (!Material.db || !Material.db.readyState) {
      throw new Error("Database connection is not established");
    }

    body[MaterailEnum.PRICE] = parseFloat( parsedBody?.data[MaterailEnum.PRICE]?.toString());
    body[MaterailEnum.STOCK] = parseFloat( parsedBody?.data[MaterailEnum.STOCK]?.toString());

    const newMaterial = new Material(body);
    const savedMaterial = await newMaterial.save();

    return new NextResponse(JSON.stringify(savedMaterial), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating material:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create material" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsedBody = materialSchema.safeParse(body);
    if (!parsedBody.success) {
      return new NextResponse(JSON.stringify({ error: parsedBody.error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const { id, ...updateData } = body;

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Material ID is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    await connectToDB();
    if (!Material.db || !Material.db.readyState) {
      throw new Error("Database connection is not established");
    }

    const updatedMaterial = await Material.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedMaterial) {
      return new NextResponse(JSON.stringify({ error: "Material not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new NextResponse(JSON.stringify(updatedMaterial), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating material:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update material" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Material ID is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    await connectToDB();
    if (!Material.db || !Material.db.readyState) {
      throw new Error("Database connection is not established");
    }

    const deletedMaterial = await Material.findByIdAndDelete(id);

    if (!deletedMaterial) {
      return new NextResponse(JSON.stringify({ error: "Material not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new NextResponse(JSON.stringify(deletedMaterial), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error deleting material:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete material" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

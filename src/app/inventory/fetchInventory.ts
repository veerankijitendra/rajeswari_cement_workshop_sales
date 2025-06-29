import { SearchParamsEnum } from "@/lib/resource";
import { TMaterialInput, TSearchParams } from "@/lib/types";

export const fetchInventory = async (
 {page,per_page,search,category}:TSearchParams
): Promise<unknown> => {
  try {
    const url = new URLSearchParams({});
    if(page) url.set(SearchParamsEnum.PAGE,page?.toString());
    if(per_page) url.set(SearchParamsEnum.PER_PAGE,per_page?.toString());
    if(search)  url.set(SearchParamsEnum.SEARCH, search?.toString());
    if(category) {

      if(typeof category === "string") url.set(SearchParamsEnum.CATEGORY, category);
      
      if(Array.isArray(category)) {
        category.forEach(each => {
          url.append(SearchParamsEnum.CATEGORY,each)
        })
      }
    } 

    const response = await fetch(
      `/api/materials?${url?.toString()}`,
      {
        method: "GET",
        // cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch inventory data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }

};


export const postMaterial = async (data:{material:TMaterialInput,isEdit:boolean}) => {
  const {material,isEdit} = data;
  try{
    const response = await fetch(
      `/api/materials`,
      {
        method: isEdit ? "PUT" : "POST",
        cache: "no-store",
        body:JSON.stringify(material)
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch inventory data");
    }

    const data = await response.json();
    return data;


  }catch(error) {
    throw error
  }
}

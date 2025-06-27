interface ICreateSale {
  isEdit: boolean;
  data: unknown;
}

export const createUpdateSales = async ({ data, isEdit = false }: ICreateSale) => {
  try {
    const url = `/api/sales`;
    const response = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Failure is occured while creating the sale.", error);
    throw error;
  }
};

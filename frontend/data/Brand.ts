import api from "@/lib/api";

export const getBrands = async () => {
  try {
    const response = await api.get("/brands");
    return response.data;
  } catch (error) {
    throw error;
  }
};
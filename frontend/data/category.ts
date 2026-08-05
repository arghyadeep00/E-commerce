import api from "@/lib/api";

export const getCategory = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getCategoryBySlug = async (slug: String) => {
  try {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

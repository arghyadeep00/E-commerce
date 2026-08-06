import api from "@/lib/api";

export const getReview = async (productId: String) => {
  try {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

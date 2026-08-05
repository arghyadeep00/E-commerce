import api from "@/lib/api";

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get("/products/featured");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNewArrivedProducts = async () => {
  try {
    const response = await api.get("/products/new-arrivals");
    return response.data;
  } catch (error) {
    throw error;
  }
};

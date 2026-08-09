import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getAllProducts = async () => {
  try {
    const token = (await cookies()).get("adminToken")?.value;
    const response = await fetch(`${API_URL}/admin/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getAllCategories = async () => {
  try {
    const token = (await cookies()).get("adminToken")?.value;
    const response = await fetch(`${API_URL}/admin/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getAllBrands = async () => {
  try {
    const token = (await cookies()).get("adminToken")?.value;
    const response = await fetch(`${API_URL}/admin/brands`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

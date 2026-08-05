import { getProductsById } from "@/data/product";
import ProductClient from "@/components/ProductClient";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  let product = null;
  try {
    product = await getProductsById(id);
  } catch (error) {
    console.error("Failed to fetch product", error);
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Product not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
      <ProductClient product={product} />
    </div>
  );
}

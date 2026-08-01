export default function BestSellerPage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            Best Sellers
          </h1>
          <p className="text-muted-foreground">Showing best selling products</p>
        </div>
      </div>
    </div>
  );
}
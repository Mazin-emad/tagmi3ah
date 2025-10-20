import { ProductDetails } from "@/components/product/ProductDetails";

const Product = () => {
  return (
    <ProductDetails
      title="Product Name"
      brand="Brand"
      price="$0.00"
      description="Product description goes here..."
      image="https://via.placeholder.com/600"
      specs={[
        { label: "Category", value: "—" },
        { label: "Brand", value: "—" },
        { label: "Model", value: "—" },
        { label: "Warranty", value: "—" },
      ]}
    />
  );
};

export default Product;

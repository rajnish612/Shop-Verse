import React from "react";
import ProductGrid from "../../components/ProductsGrid";
import { type Product } from "../../types";
import { productApis } from "../../services/products";

const DealsPage: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);

  //Fetch all latest deals
  React.useEffect(() => {
    productApis
      .getDeals()
      .then((data) => setProducts(data))
      .catch((err) => {
        console.log("err fetching deals", err);
      });
  }, []);

  return (
    <div className="py-10 max-w-[90%] m-auto">
      <ProductGrid products={products} />
    </div>
  );
};

export default DealsPage;

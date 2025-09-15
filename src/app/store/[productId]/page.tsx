
import { notFound } from 'next/navigation';
import { products, type Product } from '@/lib/products';
import ProductClient from './client';

export function generateStaticParams() {
  return products.map((product) => ({
    productId: product.id.toString(),
  }));
}

function getProduct(id: string): Product | undefined {
  return products.find(p => p.id.toString() === id);
}

const ProductPage = async ({ params: { productId } }: { params: { productId: string } }) => {
  const product = getProduct(productId);

  if (!product) {
    notFound();
  }
  
  return (
      <ProductClient product={product} />
  );
}

export default ProductPage;

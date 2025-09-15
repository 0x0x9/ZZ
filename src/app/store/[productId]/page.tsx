
import { notFound } from 'next/navigation';
import { products, type Product } from '@/lib/products';
import ProductClient from './client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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
  
  if (product.id !== 1) {
    const relatedProducts = products.filter(
      p => p.category === product.category && p.id !== product.id
    ).slice(0, 4);

    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="pt-28 pb-16 md:pt-36 md:pb-24">
              <ProductClient product={product} relatedProducts={relatedProducts} />
          </div>
        </main>
        <Footer />
      </>
    );
  }


  return (
    <>
        <Header />
        <main className="flex-1">
            <ProductClient product={product} relatedProducts={[]} />
        </main>
        <Footer />
    </>
  );
}

export default ProductPage;

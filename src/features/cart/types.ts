export interface CartItem {
  id: string;
  name: string;
  brand: string;
  href: string;
  price: number | null;
  discountPrice: number | null;
  imageUrl: string | null;
  imageAlt: string;
  quantity: number;
}

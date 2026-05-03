export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  customImage?: string;
}

export interface CartItem extends Product {
  dedication: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  emailConfirm: string;
  address: string;
  zipCode: string;
  city: string;
}

export interface Order {
  id: number;
  date: string;
  customer: {
    name: string;
    email: string;
    addr: string;
  };
  items: CartItem[];
  total: number;
  status: 'Payée' | 'En préparation' | 'Expédiée';
  paymentId?: string;
}

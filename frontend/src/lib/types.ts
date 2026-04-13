export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  cuisineType: string;
  rating: number;
  imageUrl: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  restaurantId: number;
}

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  restaurantId: number;
  restaurantName: string;
}

export interface OrderResponse {
  id: number;
  userId: number;
  restaurantId: number;
  restaurantName: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  id: number;
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
}

interface UserInk {
  user_ink_id: number;
  batch_number: string;
  opened_at: Date;
  expires_at: Date;
  favorite: boolean;
  publicink_ink_id: number;
  product_name: string;
  manufacturer: string;
  color: string;
  recalled: boolean;
  image_url: string;
  size: string;
  User_user_id: string;
}

interface PublicInk {
  ink_id: number;
  product_name: string;
  manufacturer: string;
  color: string;
  recalled: boolean;
  image_url: string;
  size: string;
}

interface User {
  user_id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

interface Entry {
  id: number;
  customer: string;
  appointment_date: Date;
  notes: string;
}

interface Customer {
  customer_id: number;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  notes: string;
  User_user_id: string;
}

export { UserInk, PublicInk, User, Entry, Customer };

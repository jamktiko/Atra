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
  entry_id: number;
  entry_date: Date;
  comments: string;
  User_user_id: string;
  Customer_customer_id: number;
}

interface EntryCreation {
  entry_date: Date;
  comments: string;
  User_user_id: string;
  Customer_customer_id: number | undefined;
  inks: number[];
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

interface CustomerCreation {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes: string;
}

export {
  UserInk,
  PublicInk,
  User,
  Entry,
  Customer,
  CustomerCreation,
  EntryCreation,
};

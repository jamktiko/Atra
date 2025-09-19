interface UserInk {
  id: number;
  name: string;
  batchnumber: string;
  openedAt: Date;
  expiresAt: Date;
  imageUrl: string;
  favorite: boolean;
}

interface PublicInk {
  id: number;
  product_name: string;
  manufacturer: string;
  color: string;
  recalled: boolean;
  imageUrl: string;
  size: string;
}

interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}

interface Entry {
  id: number;
  customer: string;
  appointment_date: Date;
  notes: string;
}

interface Customer {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
}

interface InkTest {
  id: number;
  batchnumber: string;
  publicinkId: number;
}
export { UserInk, PublicInk, User, Entry, Customer, InkTest };

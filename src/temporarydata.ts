import {
  UserInk,
  PublicInk,
  User,
  Entry,
  Customer,
  CustomerCreation,
} from './interface';

const mockImageA =
  'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/6290/AF57/6C16/A84A/5F39/0A28/1066/1F1F/DV30UNION_m.jpg';
const mockImageB =
  'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/66EA/7821/6590/F930/BEFB/0A32/0E09/BE45/ECLIPSE150_m.jpg';

export const mockUserInks: UserInk[] = [
  {
    user_ink_id: 0,
    batch_number: 'ABC123',
    opened_at: new Date('2025-01-01'),
    expires_at: new Date('2030-01-01'),
    favorite: false,
    publicink_ink_id: 0,
    product_name: 'Akun muste',
    manufacturer: 'Ankkalinnan musteet',
    color: 'Black',
    recalled: false,
    image_url: mockImageA,
    size: '100ml',
    User_user_id: 'id-here',
  },
];

export const mockPublicInks: PublicInk[] = [
  {
    ink_id: 101,
    product_name: 'Ocean Blue',
    manufacturer: 'InkWell Co.',
    color: 'Blue',
    recalled: false,
    image_url: mockImageB,
    size: '30ml',
  },
  {
    ink_id: 102,
    product_name: 'Sunset Red',
    manufacturer: 'ColorSplash',
    color: 'Red',
    recalled: true,
    image_url: mockImageA,
    size: '50ml',
  },
];

export const mockUsers: User[] = [
  {
    user_id: 'user-123',
    email: 'jane.doe@example.com',
    password: 'hashedpassword123',
    first_name: 'Jane',
    last_name: 'Doe',
  },
];

export const mockEntries: Entry[] = [
  {
    id: 1,
    customer: 'John Smith',
    appointment_date: new Date('2025-10-25T14:00:00'),
    notes: 'Discussed ink preferences and allergies.',
  },
];

export const mockCustomers: Customer[] = [
  {
    customer_id: 1,
    email: 'john.smith@example.com',
    phone: '+358401234567',
    first_name: 'John',
    last_name: 'Smith',
    notes: 'Prefers blue tones.',
    User_user_id: 'user-123',
  },
  {
    customer_id: 2,
    email: 'john.doe@example.com',
    phone: '+358401004500',
    first_name: 'Jonathan',
    last_name: 'Doe',
    notes: 'Rich guy',
    User_user_id: 'user-123',
  },
];

export const mockCustomerCreations: CustomerCreation[] = [
  {
    first_name: 'Alice',
    last_name: 'Johnson',
    email: 'alice.j@example.com',
    phone: '+358409876543',
  },
];

//older mock data
// export const Tiina: User = {
//   id: 1,
//   email: 'tiinanmaili@gmail.com',
//   firstname: 'Tiina',
//   lastname: 'Tautoija',
// };

// export const publicInks: PublicInk[] = [
//   {
//     id: 1,
//     product_name: 'Eternal Ink',
//     manufacturer: 'Eternal Ink',
//     color: 'Bright Red',
//     recalled: false,
//     imageUrl:
//       'https://kurosumi.com/cdn/shop/products/KSFGY.75-Kuro-Sumi-Fugiyama_Pink-.75oz.png?v=1656006504&width=600',
//     size: '30ml',
//   },

//   {
//     id: 2,
//     product_name: 'Dynamic Black',
//     manufacturer: 'Dynamic Color Co.',
//     color: 'Deep Black',
//     recalled: false,
//     imageUrl:
//       'https://kurosumi.com/cdn/shop/products/KSFGY.75-Kuro-Sumi-Fugiyama_Pink-.75oz.png?v=1656006504&width=600',
//     size: '240ml',
//   },

//   {
//     id: 3,
//     product_name: 'Fusion Ink',
//     manufacturer: 'Fusion Ink',
//     color: 'Arctic Blue',
//     recalled: false,
//     imageUrl:
//       'https://kurosumi.com/cdn/shop/products/KSFGY.75-Kuro-Sumi-Fugiyama_Pink-.75oz.png?v=1656006504&width=600',
//     size: '60ml',
//   },

//   {
//     id: 4,
//     product_name: 'Intenze',
//     manufacturer: 'Intenze',
//     color: 'Lemon Yellow',
//     recalled: false,
//     imageUrl:
//       'https://kurosumi.com/cdn/shop/products/KSFGY.75-Kuro-Sumi-Fugiyama_Pink-.75oz.png?v=1656006504&width=600',
//     size: '30ml',
//   },

//   {
//     id: 5,
//     product_name: 'World Famous',
//     manufacturer: 'World Famous Tattoo Ink',
//     color: 'Paris Green',
//     recalled: false,
//     imageUrl:
//       'https://kurosumi.com/cdn/shop/products/KSFGY.75-Kuro-Sumi-Fugiyama_Pink-.75oz.png?v=1656006504&width=600',
//     size: '30ml',
//   },

//   {
//     id: 6,
//     product_name: 'Kuro Sumi Outlining Ink',
//     manufacturer: 'Kuro Sumi',
//     color: 'Outlining Black',
//     recalled: false,
//     imageUrl:
//       'https://kurosumi.com/cdn/shop/products/KSFGY.75-Kuro-Sumi-Fugiyama_Pink-.75oz.png?v=1656006504&width=600',
//     size: '120ml',
//   },

//   {
//     id: 7,
//     product_name: 'StarBrite',
//     manufacturer: 'StarBrite Colors',
//     color: 'Bubblegum Pink',
//     recalled: true,
//     imageUrl:
//       'https://kurosumi.com/cdn/shop/products/KSFGY.75-Kuro-Sumi-Fugiyama_Pink-.75oz.png?v=1656006504&width=600',
//     size: '30ml',
//   },

//   {
//     id: 8,
//     product_name: 'Eternal Ink',
//     manufacturer: 'Eternal Ink',
//     color: 'White',
//     recalled: false,
//     imageUrl:
//       'https://kurosumi.com/cdn/shop/products/KSFGY.75-Kuro-Sumi-Fugiyama_Pink-.75oz.png?v=1656006504&width=600',
//     size: '120ml',
//   },

//   {
//     id: 9,
//     product_name: 'Solid Ink',
//     manufacturer: 'Solid Ink',
//     color: 'Olive Green',
//     recalled: false,
//     imageUrl:
//       'https://kurosumi.com/cdn/shop/products/KSFGY.75-Kuro-Sumi-Fugiyama_Pink-.75oz.png?v=1656006504&width=600',
//     size: '60ml',
//   },

//   {
//     id: 10,
//     product_name: 'Fusion Ink',
//     manufacturer: 'Fusion Ink',
//     color: 'Power Purple',
//     recalled: false,
//     imageUrl:
//       'https://kurosumi.com/cdn/shop/products/KSFGY.75-Kuro-Sumi-Fugiyama_Pink-.75oz.png?v=1656006504&width=600',
//     size: '30ml',
//   },
// ];

// export const userInks: UserInk[] = [
//   {
//     id: 1,
//     name: 'Eternal Ink',
//     batchnumber: 'ET-BR-2023-09-A1',
//     openedAt: new Date('2023-09-15'),
//     expiresAt: new Date('2025-09-15'),
//     imageUrl:
//       'https://kurosumi.com/cdn/shop/products/KSFGY.75-Kuro-Sumi-Fugiyama_Pink-.75oz.png?v=1656006504&width=600',
//     favorite: true,
//   },
//   {
//     id: 2,
//     name: 'Dynamic Black',
//     batchnumber: 'DY-BL-2024-01-B7',
//     openedAt: new Date('2024-01-10'),
//     expiresAt: new Date('2026-01-10'),
//     imageUrl:
//       'https://kurosumi.com/cdn/shop/products/KSFGY.75-Kuro-Sumi-Fugiyama_Pink-.75oz.png?v=1656006504&width=600',
//     favorite: true,
//   },
//   {
//     id: 3,
//     name: 'Fusion Ink',
//     batchnumber: 'FU-AB-2023-06-C4',
//     openedAt: new Date('2023-06-01'),
//     expiresAt: new Date('2025-06-01'),
//     imageUrl:
//       'https://kurosumi.com/cdn/shop/products/KSFGY.75-Kuro-Sumi-Fugiyama_Pink-.75oz.png?v=1656006504&width=600',
//     favorite: false,
//   },
//   {
//     id: 4,
//     name: 'Intenze',
//     batchnumber: 'IN-LY-2022-11-D9',
//     openedAt: new Date('2022-11-20'),
//     expiresAt: new Date('2024-11-20'),
//     imageUrl:
//       'https://kurosumi.com/cdn/shop/products/KSFGY.75-Kuro-Sumi-Fugiyama_Pink-.75oz.png?v=1656006504&width=600',
//     favorite: false,
//   },
// ];

// export const entries: Entry[] = [
//   {
//     id: 1,
//     customer: 'Alice Johnson',
//     appointment_date: new Date('2025-09-12T14:00:00'),
//     notes: 'Full sleeve consultation, prefers black and gray shading.',
//   },
//   {
//     id: 2,
//     customer: 'Bob Smith',
//     appointment_date: new Date('2025-09-13T11:30:00'),
//     notes: 'Touch-up on previous tattoo; discuss color vibrancy.',
//   },
//   {
//     id: 3,
//     customer: 'Clara Lopez',
//     appointment_date: new Date('2025-09-14T16:00:00'),
//     notes: 'Small floral design on wrist; allergic to red ink.',
//   },
//   {
//     id: 4,
//     customer: 'David Kim',
//     appointment_date: new Date('2025-09-15T09:00:00'),
//     notes: 'Geometric shoulder piece; prefers minimalist design.',
//   },
//   {
//     id: 5,
//     customer: 'Emma Brown',
//     appointment_date: new Date('2025-09-16T13:30:00'),
//     notes: 'Cover-up for old tattoo; discuss ink types and colors.',
//   },
// ];

// export const customers: Customer[] = [
//   {
//     firstname: 'Alice',
//     lastname: 'Johnson',
//     email: 'alice.johnson@example.com',
//     phonenumber: '+1 555-123-4567',
//   },
//   {
//     firstname: 'Bob',
//     lastname: 'Smith',
//     email: 'bob.smith@example.com',
//     phonenumber: '+1 555-987-6543',
//   },
//   {
//     firstname: 'Clara',
//     lastname: 'Lopez',
//     email: 'clara.lopez@example.com',
//     phonenumber: '+1 555-234-5678',
//   },
//   {
//     firstname: 'David',
//     lastname: 'Kim',
//     email: 'david.kim@example.com',
//     phonenumber: '+1 555-345-6789',
//   },
//   {
//     firstname: 'Emma',
//     lastname: 'Brown',
//     email: 'emma.brown@example.com',
//     phonenumber: '+1 555-456-7890',
//   },
//   {
//     firstname: 'Frank',
//     lastname: 'Miller',
//     email: 'frank.miller@example.com',
//     phonenumber: '+1 555-567-8901',
//   },
//   {
//     firstname: 'Grace',
//     lastname: 'Davis',
//     email: 'grace.davis@example.com',
//     phonenumber: '+1 555-678-9012',
//   },
// ];

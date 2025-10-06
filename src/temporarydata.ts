// import { UserInk, PublicInk, User, Entry, Customer } from './interface';

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

// import { addDays, format } from "date-fns";

// export const generateMockUsageData = (brandId) => {
//   const today = new Date();
//   return Array.from({ length: 7 }).map((_, index) => {
//     const date = addDays(today, -6 + index);
//     const total = Math.floor(Math.random() * 1000) + 500;
//     const failed = Math.floor(total * (Math.random() * 0.1)); // 0-10% failure rate

//     return {
//       id: `usage-${brandId}-${index}`,
//       brand_id: brandId,
//       total_requests: total,
//       successful_requests: total - failed,
//       failed_requests: failed,
//       date: format(date, "yyyy-MM-dd"),
//       created_at: date.toISOString(),
//     };
//   });
// };

// export const mockBrands = [
//   {
//     id: "11111111-1111-1111-1111-111111111111",
//     name: "Brand A", // Exact name used everywhere
//     api_key: "key_branda_123",
//     created_at: new Date().toISOString(),
//   },
//   {
//     id: "22222222-2222-2222-2222-222222222222",
//     name: "Brand B", // Exact name used everywhere
//     api_key: "key_brandb_456",
//     created_at: new Date().toISOString(),
//   },
// ];

// export const mockAuth = {
//   login: async (email, password) => {
//     if (email === "brand-a@example.com") {
//       return {
//         user: {
//           email: "brand-a@example.com",
//           brand: "Brand A", // Exact match with mockBrands
//           name: "Brand A User",
//         },
//         error: null,
//       };
//     } else if (email === "brand-b@example.com") {
//       return {
//         user: {
//           email: "brand-b@example.com",
//           brand: "Brand B", // Exact match with mockBrands
//           name: "Brand B User",
//         },
//         error: null,
//       };
//     }
//     return {
//       user: null,
//       error: "Invalid credentials",
//     };
//   },
// };

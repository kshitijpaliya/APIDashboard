// // // // app/dashboard/page.js
// // // "use client";
// // // import DashboardPage from "./DashboardPage";
// // // import { mockBrands } from "@/lib/mockData";

// // // // Mock user data - in a real app you would get this from your auth system
// // // const mockUser = {
// // //   id: "user_123",
// // //   name: "John Doe",
// // //   email: "john@example.com",
// // // };

// // // // Helper function to get brand data
// // // const getBrandData = (userId) => {
// // //   // In a real app, you would fetch this from your database
// // //   // Here we just return the first mock brand for demonstration
// // //   return mockBrands[0];
// // // };

// // // export default function Dashboard() {
// // //   const brand = getBrandData(mockUser.id);

// // //   return (
// // //     <div className="px-5">
// // //       <DashboardPage user={mockUser} />
// // //     </div>
// // //   );
// // // }
// // "use client";

// // import { useRouter } from "next/navigation";
// // import { useEffect, useState } from "react";
// // import DashboardPage from "./DashboardPage";
// // import { mockBrands } from "@/lib/mockData";

// // export default function Dashboard() {
// //   const router = useRouter();
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     // Check for user data in sessionStorage
// //     const userData = JSON.parse(sessionStorage.getItem("currentUser"));

// //     if (!userData) {
// //       router.push("/login");
// //       return;
// //     }

// //     // Find matching brand
// //     const brand = mockBrands.find((b) =>
// //       b.name.toLowerCase().includes(userData.brand)
// //     );

// //     if (!brand) {
// //       console.error("Brand not found");
// //       router.push("/login");
// //       return;
// //     }

// //     // Create full user object
// //     setUser({
// //       id: `user_${brand.id.split("-")[0]}`,
// //       name: `${brand.name} User`,
// //       email: userData.email,
// //       brandId: brand.id,
// //       brand: userData.brand,
// //     });

// //     setLoading(false);
// //   }, [router]);

// //   if (loading) {
// //     return (
// //       <div className="flex h-screen items-center justify-center">
// //         <div className="text-center">
// //           <h2 className="text-xl font-semibold">Loading dashboard...</h2>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return user ? <DashboardPage user={user} /> : null;
// // }
// // "use client";
// // import { useRouter } from "next/navigation";
// // import { useEffect, useState } from "react";
// // import DashboardPage from "./DashboardPage";
// // import { mockBrands } from "@/lib/mockData";

// // export default function Dashboard() {
// //   const router = useRouter();
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const userData = JSON.parse(sessionStorage.getItem("currentUser"));

// //     if (!userData) {
// //       router.push("/login");
// //       return;
// //     }

// //     // Match brand based on the stored brand string
// //     const brand = mockBrands.find(
// //       (b) =>
// //         b.name.toLowerCase().includes(userData.brand) ||
// //         userData.brand.includes(b.name.toLowerCase())
// //     );

// //     if (!brand) {
// //       console.error("Brand not found for:", userData.brand);
// //       router.push("/login");
// //       return;
// //     }

// //     setUser({
// //       id: `user_${brand.id.split("-")[0]}`,
// //       name: `${brand.name} User`,
// //       email: userData.email,
// //       brandId: brand.id,
// //       brand: brand.name,
// //     });

// //     setLoading(false);
// //   }, [router]);

// //   if (loading) {
// //     return (
// //       <div className="flex h-screen items-center justify-center">
// //         <div className="text-center">
// //           <h2 className="text-xl font-semibold">Loading dashboard...</h2>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return user ? <DashboardPage user={user} /> : null;
// // }
// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import DashboardPage from "./DashboardPage";

// export default function Dashboard() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const userData = JSON.parse(sessionStorage.getItem("currentUser"));

//     if (!userData) {
//       router.push("/login");
//       return;
//     }

//     // We already have the correct brand name from login
//     setUser({
//       id: `user_${userData.brandId.split("-")[0]}`,
//       name: `${userData.brand} User`,
//       email: userData.email,
//       brandId: userData.brandId,
//       brand: userData.brand,
//     });

//     setLoading(false);
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-xl font-semibold">Loading dashboard...</h2>
//         </div>
//       </div>
//     );
//   }

//   return user ? (
//     <div className="px-5">
//       <DashboardPage user={user} />
//     </div>
//   ) : null;
// }
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardPage from "./DashboardPage";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("currentUser"));
    const token = sessionStorage.getItem("authToken");

    if (!userData || !token) {
      router.push("/login");
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  return user ? (
    <div className="px-5">
      <DashboardPage user={user} />
    </div>
  ) : null;
}

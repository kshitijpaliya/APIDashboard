// // "use client";

// // import { useRouter } from "next/navigation";
// // import { useState } from "react";
// // import LoginForm from "./LoginPage";
// // import { mockAuth } from "@/lib/mockData";

// // export default function LoginPage() {
// //   const router = useRouter();
// //   const [error, setError] = useState("");

// //   const handleLogin = async (email, password) => {
// //     try {
// //       const { user, error: authError } = await mockAuth.login(email, password);

// //       if (authError || !user) {
// //         throw new Error(authError || "Invalid credentials");
// //       }

// //       // Store minimal user data in sessionStorage (clears when browser closes)
// //       sessionStorage.setItem(
// //         "currentUser",
// //         JSON.stringify({
// //           email: user.email,
// //           brand: user.brand,
// //           authenticatedAt: new Date().toISOString(),
// //         })
// //       );

// //       router.push("/dashboard");
// //     } catch (err) {
// //       setError(err.message);
// //       throw err; // Re-throw so LoginForm can handle it
// //     }
// //   };

// //   return <LoginForm onLogin={handleLogin} />;
// // }
// // "use client";
// // import { useRouter } from "next/navigation";
// // import { useState } from "react";
// // import LoginForm from "./LoginPage";
// // import { mockAuth } from "@/lib/mockData";

// // export default function LoginPage() {
// //   const router = useRouter();
// //   const [error, setError] = useState("");

// //   const handleLogin = async (email, password) => {
// //     try {
// //       const { user, error: authError } = await mockAuth.login(email, password);

// //       if (authError || !user) {
// //         throw new Error(authError || "Invalid credentials");
// //       }

// //       // Store minimal user data in sessionStorage (clears when browser closes)
// //       sessionStorage.setItem(
// //         "currentUser",
// //         JSON.stringify({
// //           email: user.email,
// //           brand: user.brand,
// //           authenticatedAt: new Date().toISOString(),
// //         })
// //       );

// //       return user; // Return user to be handled by LoginForm
// //     } catch (err) {
// //       setError(err.message);
// //       throw err; // Re-throw so LoginForm can handle it
// //     }
// //   };

// //   return <LoginForm onLogin={handleLogin} />;
// // }
// "use client";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import LoginForm from "./LoginPage";
// import { mockAuth, mockBrands } from "@/lib/mockData";

// export default function LoginPage() {
//   const router = useRouter();
//   const [error, setError] = useState("");

//   const handleLogin = async (email, password) => {
//     try {
//       const { user, error: authError } = await mockAuth.login(email, password);

//       if (authError || !user) {
//         throw new Error(authError || "Invalid credentials");
//       }

//       // Find the matching brand to store consistent data
//       const brand = mockBrands.find(
//         (b) => b.name.toLowerCase() === user.brand.toLowerCase()
//       );

//       if (!brand) {
//         throw new Error("Brand configuration not found");
//       }

//       sessionStorage.setItem(
//         "currentUser",
//         JSON.stringify({
//           email: user.email,
//           brand: brand.name, // Store the exact brand name from mockBrands
//           brandId: brand.id, // Also store the brand ID for easy reference
//           authenticatedAt: new Date().toISOString(),
//         })
//       );

//       return user;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   return <LoginForm onLogin={handleLogin} />;
// }
"use client";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginPage";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const { token, user } = await response.json();

      // Store token and user data
      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("currentUser", JSON.stringify(user));

      return user;
    } catch (error) {
      throw error;
    }
  };

  return <LoginForm onLogin={handleLogin} />;
}

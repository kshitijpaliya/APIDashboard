"use client";
import { useState } from "react";
import LoginPage from "@/app/login/page";
import Dashboard from "@/app/dashboard/page";

export default function Home() {
  const [user, setUser] = useState(null);
  return (
    <div className="min-h-screen bg-gray-50">
      {user ? <Dashboard user={user} /> : <LoginPage onLogin={setUser} />}
    </div>
  );
}

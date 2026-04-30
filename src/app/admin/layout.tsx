"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [user, loading, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-carleton-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-full">
      <div className="bg-carleton-blue/10 border-b border-carleton-blue/20 px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-sm">
        <span className="text-gray-500">
          Signed in as <span className="text-carleton-blue font-medium">{user.email}</span>
        </span>
        <button
          onClick={() => signOut(auth).then(() => router.replace("/admin/login"))}
          className="text-gray-400 hover:text-carleton-blue transition-colors"
        >
          Sign out
        </button>
      </div>
      {children}
    </div>
  );
}

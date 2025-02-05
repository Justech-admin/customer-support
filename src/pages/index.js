import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login"); // Redirect to login page if not authenticated
    }
  }, [session, router]);

  if (!session) {
    return <div>Loading...</div>; // Optional: Show loading while redirecting
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      {/* Add content for logged-in users */}
    </div>
  );
}

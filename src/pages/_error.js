import { useRouter } from "next/router";

export default function CustomErrorPage() {
  const router = useRouter();
  const { statusCode } = router.query;

  if (statusCode === 404) {
    router.push("/login"); // Redirect to login page if 404
  }

  return <div>Redirecting to login...</div>;
}

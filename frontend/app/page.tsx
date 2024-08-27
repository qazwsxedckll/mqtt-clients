import AuthCard from "@/components/auth-card";
import { LoginForm } from "@/components/login";
import { getUser, verifySession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await verifySession();
  if (user) {
    redirect("/mqtt-clients");
  }

  return (
    <AuthCard
      title="Login"
      description="Enter your infomation below to login to your account"
    >
      <LoginForm />
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
    </AuthCard>
  );
}

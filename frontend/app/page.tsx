import AuthCard from "@/components/auth-card";
import { LoginForm } from "@/components/login";
import { SignUpForm } from "@/components/signup";
import Link from "next/link";

export default async function Page() {
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

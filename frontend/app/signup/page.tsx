import AuthCard from "@/components/auth-card";
import { SignUpForm } from "@/components/signup";
import Link from "next/link";

export default async function Page() {
  return (
    <AuthCard
      title="Sign Up"
      description="Enter your information to create an account"
    >
      <SignUpForm />
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/" className="underline">
          Login
        </Link>
      </div>
    </AuthCard>
  );
}

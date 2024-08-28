"use client";

import { Input } from "@/components/ui/input";
import { login } from "@/actions/auth";
import { useFormState } from "react-dom";
import { Label } from "@/components/ui/label";
import SubmitButton from "./submit-button";

export function LoginForm() {
  const [state, action, pending] = useFormState(login, undefined);

  return (
    <form action={action}>
      <div className="space-y-2">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input placeholder="Username" id="username" name="username" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" />
        </div>
      </div>
      <div className="text-red-500 text-sm">
        {state?.message && <p>{state.message}</p>}
      </div>
      <div className="mt-4">
        <SubmitButton message="Login" />
      </div>
    </form>
  );
}

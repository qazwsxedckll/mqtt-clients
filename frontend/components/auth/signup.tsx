"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signup } from "@/actions/auth";
import { useFormState } from "react-dom";
import SubmitButton from "@/components/auth/submit-button";

export default function SignUpForm() {
  const [state, action] = useFormState(signup, undefined);

  return (
    <form action={action}>
      <div className="space-y-2">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input placeholder="Username" id="username" name="username" />
          {state?.errors?.username && (
            <p className="text-red-500 text-sm">{state.errors.username[0]}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" />
          {state?.errors?.password && (
            <div className="text-red-500 text-sm">
              <p>Password must:</p>
              <ul>
                {state.errors.password.map((error) => (
                  <li key={error}>- {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="confirm">Repeat your password</Label>
          <Input id="confirm" name="confirm" type="password" />
          {state?.errors?.confirm && (
            <p className="text-red-500 text-sm">{state.errors.confirm[0]}</p>
          )}
        </div>
        <div className="text-red-500 text-sm">
          {state?.message && <p>{state.message}</p>}
        </div>
      </div>
      <div className="mt-4">
        <SubmitButton message="Create an account" />
      </div>
    </form>
  );
}

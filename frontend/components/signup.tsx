"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { signup } from "@/actions/auth";
import { signupFormSchema } from "@/lib/signup";
import { z } from "zod";
import { useFormState } from "react-dom";

export function SignUpForm() {
  const [state, action, pending] = useFormState(signup, undefined);

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirm: "",
      ...(state?.fields ?? {}),
    },
  });

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={action}
        onSubmit={form.handleSubmit(() => formRef.current?.submit())}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              {state?.errors?.username ? (
                <p className="text-red-500">{state.errors.username[0]}</p>
              ) : (
                <FormMessage />
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              {state?.errors?.password ? (
                <div className="text-red-500">
                  <p>Password must:</p>
                  <ul>
                    {state.errors.password.map((error) => (
                      <li key={error}>- {error}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <FormMessage />
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repeat your password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              {state?.errors?.confirm ? (
                <p className="text-red-500">{state.errors.confirm[0]}</p>
              ) : (
                <FormMessage />
              )}
            </FormItem>
          )}
        />
        <Button className="w-full mt-4" type="submit" disabled={pending}>
          {pending ? "Submitting..." : "Create an account"}
        </Button>
      </form>
    </Form>
  );
}

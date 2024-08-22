"use server";

import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import prisma from "@/lib/db";
import { signupFormSchema } from "@/lib/signup";

interface ActionResult {
  error: string;
}

export type SignUpFormState =
  | {
      fields?: {
        username?: string;
      };
      errors?: {
        username?: string[];
        password?: string[];
        confirm?: string[];
      };
      message?: string;
    }
  | undefined;

export async function signup(
  state: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  console.log("signup action");

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const validatedFields = signupFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!validatedFields.success) {
    return {
      fields: validatedFields.data,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  } else {
    if (validatedFields.data.username === "test") {
      return {
        fields: {
          username: validatedFields.data.username,
        },
      };
    }
  }

  const passwordHash = await hash(validatedFields.data.password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const userId = generateIdFromEntropySize(10); // 16 characters long

  return;

  // TODO: check if username is already used
  await prisma.user.create({
    data: {
      id: userId,
      userName: validatedFields.data.username,
      passwordHash,
    },
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}

async function login(_: any, formData: FormData): Promise<ActionResult> {
  "use server";
  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      userName: username,
    },
  });
  if (!existingUser) {
    return {
      error: "Incorrect username or password",
    };
  }

  const validPassword = await verify(existingUser.passwordHash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}

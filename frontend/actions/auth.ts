"use server";

import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia, verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import prisma from "@/lib/db";
import { loginFormSchema, signupFormSchema } from "@/lib/auth-schema";
import { Prisma } from "@prisma/client";

const option = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

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

export type LoginFormState =
  | {
      fields?: {
        username?: string;
      };
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export async function signup(
  state: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
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
  }

  const passwordHash = await hash(validatedFields.data.password, option);
  const userId = generateIdFromEntropySize(10); // 16 characters long

  try {
    await prisma.user.create({
      data: {
        id: userId,
        userName: validatedFields.data.username,
        passwordHash,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          fields: {
            username: validatedFields.data.username,
          },
          errors: {
            username: ["Username is already taken"],
          },
        };
      }
    }
    throw e;
  }

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect("/");
}

export async function login(
  _: any,
  formData: FormData
): Promise<LoginFormState> {
  "use server";
  const validatedFields = loginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      fields: validatedFields.data,
      message: "Incorrect username or password",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      userName: validatedFields.data.username,
    },
  });

  if (!existingUser) {
    return {
      fields: validatedFields.data,
      message: "Incorrect username or password",
    };
  }

  const validPassword = await verify(
    existingUser.passwordHash,
    validatedFields.data.password,
    option
  );
  if (!validPassword) {
    return {
      fields: validatedFields.data,
      message: "Incorrect username or password",
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

export async function logout() {
  const { session } = await verifySession();
  if (!session) {
    return redirect("/");
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}

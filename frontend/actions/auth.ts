"use server"

import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { z } from "zod";
import prisma from "@/lib/db";

interface ActionResult {
	error: string;
}

export const signupFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(255, { message: 'Name must be at most 255 characters long.' })
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: 'Contain at least one special character.',
    // })
    .trim(),
	confirm: z.string(),
}).refine(data => data.password === data.confirm, {
	message: 'Passwords do not match',
	path: ['confirm']
});

export type FormState = {
      errors?: {
        name?: string[]
        password?: string[]
      }
      message?: string
    } | undefined

export async function signup(state: FormState, formData: FormData){
	const validatedFields = signupFormSchema.safeParse({
		name: formData.get("name"),
		password: formData.get("password"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const passwordHash = await hash(validatedFields.data.password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
	const userId = generateIdFromEntropySize(10); // 16 characters long

	// TODO: check if username is already used
    await prisma.user.create({
        data: {
            id: userId,
            userName: validatedFields.data.username,
            passwordHash
        }
    });

	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
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
			error: "Invalid username"
		};
	}
	const password = formData.get("password");
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		return {
			error: "Invalid password"
		};
	}

    const existingUser = await prisma.user.findUnique({
        where: {
            userName: username
        }
    });
	if (!existingUser) {
		return {
			error: "Incorrect username or password"
		};
	}

	const validPassword = await verify(existingUser.passwordHash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
	if (!validPassword) {
		return {
			error: "Incorrect username or password"
		};
	}

	const session = await lucia.createSession(existingUser.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/");
}
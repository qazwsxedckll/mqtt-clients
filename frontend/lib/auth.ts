import "server-only";
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { cache } from "react";
import { cookies } from "next/headers";

import type { Session, User } from "lucia";

const client = new PrismaClient();

const adapter = new PrismaAdapter(client.session, client.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: true,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      username: attributes.username,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
}

export const verifySession = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return { user: null, session: null };
    }

    return await lucia.validateSession(sessionId);
  }
);

export const getUser = cache(async (): Promise<User | null> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return null;
  }

  const { user } = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  // try {
  //   if (result.session && result.session.fresh) {
  //     const sessionCookie = lucia.createSessionCookie(result.session.id);
  //     cookies().set(
  //       sessionCookie.name,
  //       sessionCookie.value,
  //       sessionCookie.attributes
  //     );
  //   }
  //   if (!result.session) {
  //     const sessionCookie = lucia.createBlankSessionCookie();
  //     cookies().set(
  //       sessionCookie.name,
  //       sessionCookie.value,
  //       sessionCookie.attributes
  //     );
  //   }
  // } catch {}
  return user;
});

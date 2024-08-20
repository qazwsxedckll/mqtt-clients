"use client";

import { Button } from "./ui/button";
import { signOut } from "@/auth";

export default function LogoutButton() {
  return (
    <Button
      onClick={async () => {
        "use server";
        await signOut();
      }}
    >
      Logout
    </Button>
  );
}

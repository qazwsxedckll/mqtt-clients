import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function SubmitButton({ message }: { message: string }) {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? "Submitting..." : message ?? "Sign up"}
    </Button>
  );
}

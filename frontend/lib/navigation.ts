import { LucideIcon, Send } from "lucide-react";

export interface Navigation {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const navigations: Navigation[] = [
  {
    name: "MQTT Clients",
    href: "/mqtt-clients",
    icon: Send,
  },
];

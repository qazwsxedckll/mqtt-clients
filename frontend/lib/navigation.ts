import { Users, LucideIcon, Castle, Send } from "lucide-react";

export interface Navigation {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const navigations: Navigation[] = [
  {
    name: "Home",
    href: "/home",
    icon: Castle,
  },
  {
    name: "Things",
    href: "/things",
    icon: Users,
  },
  {
    name: "MQTT Clients",
    href: "/mqtt-clients",
    icon: Send,
  },
];

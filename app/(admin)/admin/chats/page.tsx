import { Metadata } from "next";
import ChatsClient from "./ChatsClient";

export const metadata: Metadata = {
  title: "Patient Chats | Admin Dashboard",
  description: "Manage real-time chats from patients on the website.",
};

export default function ChatsPage() {
  return <ChatsClient />;
}

import { createFileRoute } from "@tanstack/react-router";
import { DeskApp } from "@/components/orion/app";

export const Route = createFileRoute("/")({
  component: DeskApp,
});

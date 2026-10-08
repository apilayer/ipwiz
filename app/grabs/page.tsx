import { redirect } from "next/navigation";

/** Renamed to /link-grabber; existing links and bookmarks still land. */
export default function GrabsIndexPage() {
  redirect("/link-grabber");
}

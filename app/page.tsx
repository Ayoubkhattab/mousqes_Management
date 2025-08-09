import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOKEN_COOKIE } from "@/lib/auth/constants";

export default function Home() {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  if (token) redirect("/dashboard");
  redirect("/login");
}

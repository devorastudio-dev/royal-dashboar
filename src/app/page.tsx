import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // troque para "/(dashboard)" ou outra rota se preferir
}
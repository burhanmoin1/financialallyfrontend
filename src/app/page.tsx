import Image from "next/image";
import ActivationRedirect from "./components/ActivationRedirect";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <ActivationRedirect/>
    </main>
  );
}

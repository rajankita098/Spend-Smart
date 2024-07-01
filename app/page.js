import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "./_components/Header"; // Adjust the path as needed
import Hero from "./_components/Hero"; // Adjust the path as needed

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
    </div>
  );
}

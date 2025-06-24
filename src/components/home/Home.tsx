"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full overflow-clip items-center justify-center p-4">
      <Image
        src="/ganesh_2.png"
        alt="Lord Ganesha Idol"
        width={400}
        height={400}
        className="rounded-xl"
        priority
      />

      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Welcome to Rajaswari Cement & Iron Shop
      </h1>
      <div className="flex space-x-6">
        <Button
          onClick={() => router.push("/inventory")}
          className="btn-secondary"
        >
          Materials
        </Button>
        <Button
          onClick={() => router.push("/sales")}
          className="btn-primary"
        >
          Sales
        </Button>
      </div>
    </div>
  );
}
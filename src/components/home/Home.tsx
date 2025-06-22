"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function Home() {
    const router = useRouter();

    return (
      <div className="flex flex-col min-h-screen w-full items-center justify-center p-4">
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
          <button
            onClick={() => router.push("/sales")}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold text-lg"
          >
            Sales
          </button>
          <button
            onClick={() => router.push("/inventory")}
            className="px-8 py-4 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-semibold text-lg"
          >
            Materials
          </button>
        </div>
      </div>
    );
}
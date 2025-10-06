// ❗ Server component wrapper (JANGAN pakai "use client")
export const dynamic = "force-dynamic"; // cegah SSG/ISR
export const revalidate = 0;

import Link from "next/link";
import { FiHome } from "react-icons/fi";
import Table from "@/app/components/dataMaster/masterPeriode/Table"; // <- ini client component

export default function MasterPeriode() {
  return (
    <>
      <div className="flex items-center mt-2">
        <Link href="/" className="mr-1">
          <FiHome />
        </Link>
        <p className="mr-1">/ Data Master /</p>
        <p className="mr-1 font-semibold text-gray-1200">Master Periode</p>
      </div>

      <div className="mt-3 rounded-xl shadow-lg border">
        <Table />
      </div>
    </>
  );
}

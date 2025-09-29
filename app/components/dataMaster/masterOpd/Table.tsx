'use client'

import { ButtonGreen, ButtonRed } from "@/app/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/app/components/global/Alert";
import { useState, useEffect } from "react";
import { LoadingClip } from "@/app/components/global/Loading";
import { getToken } from "@/app/components/lib/Cookie";
import Link from 'next/link';

// --- FIX: Interface yang benar untuk struktur data Lembaga ---
interface Lembaga {
    id: string;
    nama_lembaga: string;
    is_active: boolean;
}

// --- FIX: Interface yang benar untuk struktur data OPD dari API ---
interface Opd {
    id: string | number; // Properti 'id' yang sebelumnya hilang
    kode_opd: string;
    nama_opd: string;
    singkatan: string;
    alamat: string;
    telepon: string;
    fax: string;
    email: string;
    website: string;
    nama_kepala_opd: string;
    nip_kepala_opd: string;
    pangkat_kepala: string;
    id_lembaga: Lembaga;
}

// --- A generic type for API responses to avoid 'any' ---
interface ApiResponse<T> {
    data: T;
    code?: number;
    message?: string;
}

const Table = () => {
    // --- FIX: Menggunakan interface Opd yang sudah benar ---
    const [opd, setOpd] = useState<Opd[]>([]);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [dataNull, setDataNull] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchOpd = async () => {
            setLoading(true);
            setError(false);
            setDataNull(false);
            try {
                const response = await fetch(`https://periode-service-test.zeabur.app/list_opd`, { // Assuming this is the correct endpoint
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const result: ApiResponse<Opd[]> = await response.json();

                if (result.data && result.data.length > 0) {
                    setOpd(result.data);
                } else {
                    setDataNull(true);
                    setOpd([]);
                }
            } catch (err) {
                setError(true);
                console.error("Error fetching OPD data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchOpd();
    }, [token]);

    // --- FIX: Tipe parameter 'id' sudah benar (bukan lagi ItemType) ---
    const hapusOpd = async (id: string | number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/opd/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // Gunakan notifikasi yang sudah ada, bukan alert()
                AlertNotification("Gagal", "Gagal menghapus data dari server.", "error", 2000);
                return; // Hentikan fungsi jika gagal
            }

            // --- FIX: Logika filter sudah benar, membandingkan 'id' dengan 'id' ---
            setOpd(currentOpd => currentOpd.filter((data) => data.id !== id));

            AlertNotification("Berhasil", "Data Perangkat Daerah Berhasil Dihapus", "success", 1000);
        } catch (err) {
            console.error("Delete failed:", err)
            AlertNotification("Gagal", "Cek koneksi internet atau database server", "error", 2000);
        }
    };

    if (loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5 text-center">Gagal memuat data. Periksa koneksi internet atau server.</h1>
            </div>
        )
    }

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#99CEF5] text-white text-sm">
                            <th className="border-r border-b px-4 py-3">No</th>
                            <th className="border-r border-b px-4 py-3">Kode Perangkat Daerah</th>
                            <th className="border-r border-b px-4 py-3">Nama Perangkat Daerah</th>
                            <th className="border-r border-b px-4 py-3">Nama Kepala</th>
                            <th className="border-r border-b px-4 py-3">NIP Kepala</th>
                            <th className="border-r border-b px-4 py-3">Pangkat Kepala</th>
                            <th className="border-r border-b px-4 py-3">Lembaga</th>
                            <th className="border-b px-4 py-3">Aksi</th>
                        </tr>
                    </thead>
                    {/* --- FIX: Menampilkan data dari state 'opd', bukan DataDummy --- */}
                    <tbody>
                        {dataNull ?
                            <tr>
                                <td className="px-6 py-4 text-center" colSpan={8}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            opd.map((data, index) => (
                                <tr key={data.id} className="border-t text-sm">
                                    <td className="border-r border-b px-4 py-2 text-center">{index + 1}</td>
                                    <td className="border-r border-b px-4 py-2">{data.kode_opd || "-"}</td>
                                    <td className="border-r border-b px-4 py-2">{data.nama_opd || "-"}</td>
                                    <td className="border-r border-b px-4 py-2">{data.nama_kepala_opd || "-"}</td>
                                    <td className="border-r border-b px-4 py-2">{data.nip_kepala_opd || "-"}</td>
                                    <td className="border-r border-b px-4 py-2">{data.pangkat_kepala || "-"}</td>
                                    <td className="border-r border-b px-4 py-2">{data.id_lembaga?.nama_lembaga || "-"}</td>
                                    <td className="border-b px-4 py-2">
                                        <div className="flex flex-col justify-center items-center gap-2">
                                            {/* --- BEST PRACTICE: Menggunakan Link dari Next.js --- */}
                                            <Link href={`/dataMaster/masterOpd/${data.id}`} className="w-full">
                                                <ButtonGreen className="w-full text-xs">Edit</ButtonGreen>
                                            </Link>
                                            <ButtonRed
                                                className="w-full text-xs"
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", `Yakin ingin menghapus ${data.nama_opd}?`, "question", "Hapus", "Batal").then((result) => {
                                                        if (result.isConfirmed) {
                                                            hapusOpd(data.id);
                                                        }
                                                    });
                                                }}
                                            >
                                                Hapus
                                            </ButtonRed>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;

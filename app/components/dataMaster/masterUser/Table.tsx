'use client'

import { ButtonGreen, ButtonRed, ButtonSkyBorder, ButtonGreenBorder, ButtonBlackBorder } from "@/app/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/app/components/global/Alert";
import { LoadingClip } from "@/app/components/global/Loading";
import { useState, useEffect } from "react";
import { getToken } from "@/app/components/lib/Cookie";
import Select from 'react-select';
import Link from "next/link";

// --- INTERFACES ---
interface OptionTypeString {
    value: string;
    label: string;
}

interface Role {
    id: string;
    role: string;
}

interface User {
    id: number;
    nip: string;
    email: string;
    nama_pegawai: string;
    is_active: boolean;
    role: Role[];
}

// A generic type for API responses
interface ApiResponse<T> {
    data: T;
    code?: number;
    message?: string;
}

// Interface for OPD options in the dropdown
interface OpdOption {
    kode_opd: string;
    nama_opd: string;
}

const Table = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedOpd, setSelectedOpd] = useState<OptionTypeString | null>(null);
    const [levelUser, setLevelUser] = useState<string>(''); // State for level filter
    const [opdOptions, setOpdOptions] = useState<OptionTypeString[]>([]);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false); // Initially false
    const [opdLoading, setOpdLoading] = useState<boolean>(false);
    const [dataNull, setDataNull] = useState<boolean>(false);
    const token = getToken();

    // --- FETCH USERS WHEN an OPD is selected ---
    useEffect(() => {
        if (!selectedOpd?.value) {
            setUsers([]); // Clear users if no OPD is selected
            return;
        };

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchUsers = async () => {
            setLoading(true);
            setError(false);
            setDataNull(false);
            try {
                // Fetch users based on selected OPD and level
                const response = await fetch(`https://periode-service-test.zeabur.app/list_user?kode_opd=1.01.2.22.0.00.01.0000`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const result: ApiResponse<User[]> = await response.json();

                if (result.data && result.data.length > 0) {
                    setUsers(result.data);
                } else {
                    setDataNull(true);
                    setUsers([]);
                }
            } catch (err) {
                setError(true);
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [token, selectedOpd, levelUser]);

    // --- FETCH OPD LIST for the dropdown ---
    const fetchOpd = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setOpdLoading(true);
        try {
            // Assuming an endpoint to get all OPDs exists
            const response = await fetch(`https://periode-service-test.zeabur.app/list_user?kode_opd=1.01.2.22.0.00.01.0000`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Could not fetch OPD data');
            }
            const result: ApiResponse<OpdOption[]> = await response.json();
            const options = result.data.map((item) => ({
                value: item.kode_opd,
                label: item.nama_opd,
            }));
            setOpdOptions(options);
        } catch (err) {
            console.error('Failed to fetch OPD options:', err);
        } finally {
            setOpdLoading(false);
        }
    };

    const hapusUser = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/user/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                AlertNotification("Gagal", "Gagal menghapus data dari server.", "error", 2000);
                return;
            }
            setUsers(currentUser => currentUser.filter((user) => user.id !== id));
            AlertNotification("Berhasil", "Data User Berhasil Dihapus", "success", 1000);
        } catch (err) {
            console.error("Delete failed:", err)
            AlertNotification("Gagal", "Cek koneksi internet atau database server", "error", 2000);
        }
    };

    const renderFilterButtons = () => {
        const levels = [
            { id: '', label: 'Semua Level', Component: ButtonBlackBorder },
            { id: 'super_admin', label: 'Super Admin', Component: ButtonSkyBorder },
            { id: 'admin_opd', label: 'Admin OPD', Component: ButtonSkyBorder },
            { id: 'level_1', label: 'Level 1', Component: ButtonGreenBorder },
            { id: 'level_2', label: 'Level 2', Component: ButtonGreenBorder },
            { id: 'level_3', label: 'Level 3', Component: ButtonGreenBorder },
            { id: 'level_4', label: 'Level 4', Component: ButtonGreenBorder },
        ];
    
        return levels.map(level => {
            if (levelUser === level.id) {
                return (
                    <button key={level.id} className={`px-3 py-1 text-center rounded-lg text-white ${level.id.includes('admin') ? 'bg-sky-500' : level.id.includes('level') ? 'bg-green-500' : 'bg-black'}`}>
                        {level.label}
                    </button>
                );
            }
            const ButtonComponent = level.Component;
            return (
                <ButtonComponent key={level.id} onClick={() => setLevelUser(level.id)}>
                    {level.label}
                </ButtonComponent>
            );
        });
    };

    return (
        <>
            <div className="flex flex-wrap gap-4 items-center justify-between px-3 py-2">
                <div className="uppercase">
                    <Select
                        styles={{
                            control: (baseStyles) => ({ ...baseStyles, borderRadius: '8px', minWidth: '320px', maxWidth: '700px' })
                        }}
                        onChange={(option) => setSelectedOpd(option)}
                        options={opdOptions}
                        placeholder="Filter berdasarkan OPD"
                        isClearable
                        value={selectedOpd}
                        isLoading={opdLoading}
                        isSearchable
                        onMenuOpen={() => {
                            if (opdOptions.length === 0) {
                                fetchOpd();
                            }
                        }}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {renderFilterButtons()}
                </div>
            </div>

            {error && (
                 <div className="border p-5 rounded-xl shadow-xl m-3">
                    <h1 className="text-red-500 mx-5 py-5 text-center">Gagal memuat data. Periksa koneksi internet atau server.</h1>
                </div>
            )}
            
            {!selectedOpd && !error && (
                 <div className="border p-5 rounded-xl shadow-xl m-3">
                    <h1 className="mx-5 py-5 text-center text-gray-500">Silakan pilih OPD untuk menampilkan data pengguna.</h1>
                </div>
            )}

            {selectedOpd && (
                loading ? (
                    <div className="border p-5 rounded-xl shadow-xl m-3">
                        <LoadingClip className="mx-5 py-5" />
                    </div>
                ) : (
                    <div className="overflow-auto m-2 rounded-t-xl border">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-emerald-500 text-white text-sm">
                                    <th className="border-r border-b px-4 py-3">No</th>
                                    <th className="border-r border-b px-4 py-3">Nama</th>
                                    <th className="border-r border-b px-4 py-3">NIP</th>
                                    <th className="border-r border-b px-4 py-3">Email</th>
                                    <th className="border-r border-b px-4 py-3">Status</th>
                                    <th className="border-r border-b px-4 py-3">Roles</th>
                                    <th className="border-b px-4 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataNull ? (
                                    <tr>
                                        <td className="px-6 py-4 text-center" colSpan={7}>Data Kosong</td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr key={user.id} className="border-t text-sm">
                                            <td className="border-r border-b px-4 py-2 text-center">{index + 1}</td>
                                            <td className="border-r border-b px-4 py-2">{user.nama_pegawai || "-"}</td>
                                            <td className="border-r border-b px-4 py-2">{user.nip || "-"}</td>
                                            <td className="border-r border-b px-4 py-2">{user.email || "-"}</td>
                                            <td className="border-r border-b px-4 py-2 text-center">{user.is_active ? "Aktif" : "Tidak Aktif"}</td>
                                            <td className="border-r border-b px-4 py-2 text-center">
                                                {user.role ? user.role.map(r => r.role).join(", ") : "-"}
                                            </td>
                                            <td className="border-b px-4 py-2">
                                                <div className="flex justify-center items-center gap-2">
                                                    <Link href={`/dataMaster/masterUser/${user.id}`} className="w-full max-w-[80px]">
                                                        <ButtonGreen className="w-full text-xs">Edit</ButtonGreen>
                                                    </Link>
                                                    <ButtonRed
                                                        className="w-full text-xs max-w-[80px]"
                                                        onClick={() => {
                                                            AlertQuestion("Hapus?", `Yakin ingin menghapus ${user.nama_pegawai}?`, "question", "Hapus", "Batal").then((result) => {
                                                                if (result.isConfirmed) {
                                                                    hapusUser(user.id);
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
                                )}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </>
    )
}

export default Table;

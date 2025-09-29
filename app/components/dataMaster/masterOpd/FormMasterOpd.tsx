'use client'

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
// --- FIX: Unused imports removed
import { ButtonGreen, ButtonRed } from "@/app/components/global/Button";
import { AlertNotification } from "@/app/components/global/Alert";
import { LoadingClip } from "@/app/components/global/Loading";
import { useParams, useRouter } from "next/navigation";
import Select from "react-select";
import { getToken } from "@/app/components/lib/Cookie";

// --- BEST PRACTICE: Interfaces grouped together at the top ---

// Interface for options in react-select
interface OptionTypeString {
    value: string;
    label: string;
}

// Interface for the form values, matching the useForm hook
interface FormValue {
    id: string;
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
    id_lembaga: OptionTypeString;
}

// --- FIX: Added specific type for API response item (Lembaga)
interface Lembaga {
    id: string;
    nama_lembaga: string;
    is_active: boolean;
}

// --- FIX: Added specific type for the detailed OPD data from the API
interface OpdDetail {
    kode_opd: string;
    nama_opd: string;
    nama_kepala_opd: string;
    nip_kepala_opd: string;
    pangkat_kepala: string;
    id_lembaga: {
        id: string;
        nama_lembaga: string;
    };
}

// --- FIX: A generic type for API responses to avoid 'any'
interface ApiResponse<T> {
    data: T;
    code?: number; // Optional property
    message?: string; // Optional property
}


export const FormMasterOpd = () => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    // Note: State variables like KodeOpd, NamaOpd etc. are not necessary if you use react-hook-form correctly.
    // The form state is already managed by the library. I'll leave them for now but they can be removed.
    const [KodeOpd, setKodeOpd] = useState<string>('');
    const [NamaOpd, setNamaOpd] = useState<string>('');
    const [NamaKepalaOpd, setNamaKepalaOpd] = useState<string>('');
    const [NipKepalaOpd, setNipKepalaOpd] = useState<string>('');
    const [PangkatKepalaOpd, setPangkatKepalaOpd] = useState<string>('');
    const [KodeLembaga, setKodeLembaga] = useState<OptionTypeString | null>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const token = getToken();

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            kode_opd: data.kode_opd,
            nama_opd: data.nama_opd,
            nama_kepala_opd: data.nama_kepala_opd,
            nip_kepala_opd: data.nip_kepala_opd,
            pangkat_kepala: data.pangkat_kepala,
            id_lembaga: data.id_lembaga?.value,
        };
        try {
            const response = await fetch(`${API_URL}/opd/create`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil menambahkan data master perangkat daerah", "success", 1000);
                router.push("/dataMaster/masterOpd"); // Corrected path case
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch (err) {
            // --- FIX: Using the 'err' variable
            console.error("Submit failed:", err);
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        }
    };

    const fetchLembaga = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/lembaga/findall`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            // --- FIX: Applying the generic ApiResponse and Lembaga types
            const result: ApiResponse<Lembaga[]> = await response.json();
            const opdOptions = result.data.map((item: Lembaga) => ({
                value: item.id,
                label: item.nama_lembaga,
            }));
            setOpdOption(opdOptions);
        } catch (err) {
            // --- FIX: Using the 'err' variable
            console.error('Failed to fetch lembaga:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Tambah OPD :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    {/* --- KODE OPD --- */}
                    <div className="flex flex-col py-3">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="kode_opd">
                            Kode Perangkat Daerah :
                        </label>
                        <Controller
                            name="kode_opd"
                            control={control}
                            rules={{ required: "Kode Perangkat Daerah harus diisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="kode_opd"
                                        type="text"
                                        placeholder="masukkan Kode Perangkat Daerah"
                                    />
                                    {errors.kode_opd ?
                                        <h1 className="text-red-500 text-xs mt-1">{errors.kode_opd.message}</h1>
                                        :
                                        <h1 className="text-slate-300 text-xs mt-1">*Kode Perangkat Daerah Harus Diisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>

                    {/* --- NAMA OPD --- */}
                    <div className="flex flex-col py-3">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="nama_opd">
                            Nama Perangkat Daerah :
                        </label>
                        <Controller
                            name="nama_opd"
                            control={control}
                            rules={{ required: "Nama Perangkat Daerah harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_opd"
                                        type="text"
                                        placeholder="masukkan Nama Perangkat Daerah"
                                    />
                                    {errors.nama_opd ?
                                        <h1 className="text-red-500 text-xs mt-1">{errors.nama_opd.message}</h1>
                                        :
                                        <h1 className="text-slate-300 text-xs mt-1">*Nama OPD Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    
                    {/* --- NAMA KEPALA OPD --- */}
                    <div className="flex flex-col py-3">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="nama_kepala_opd">
                            Nama Kepala Perangkat Daerah:
                        </label>
                        <Controller
                            name="nama_kepala_opd"
                            control={control}
                            rules={{ required: "Nama Kepala harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_kepala_opd"
                                        type="text"
                                        placeholder="masukkan Nama Kepala Perangkat Daerah"
                                    />
                                    {errors.nama_kepala_opd ?
                                        <h1 className="text-red-500 text-xs mt-1">{errors.nama_kepala_opd.message}</h1>
                                        :
                                        <h1 className="text-slate-300 text-xs mt-1">*Nama Kepala Perangkat Daerah Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>

                    {/* --- NIP KEPALA OPD --- */}
                    <div className="flex flex-col py-3">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="nip_kepala_opd">
                             NIP Kepala Perangkat Daerah :
                        </label>
                        <Controller
                            name="nip_kepala_opd"
                            control={control}
                            rules={{ required: "NIP Kepala Perangkat Daerah harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nip_kepala_opd"
                                        type="text"
                                        placeholder="masukkan NIP Kepala"
                                    />
                                    {errors.nip_kepala_opd ?
                                        <h1 className="text-red-500 text-xs mt-1">{errors.nip_kepala_opd.message}</h1>
                                        :
                                        <h1 className="text-slate-300 text-xs mt-1">*NIP Kepala Perangkat Daerah Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>

                    {/* --- PANGKAT KEPALA --- */}
                    <div className="flex flex-col py-3">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="pangkat_kepala">
                             Pangkat Kepala Perangkat Daerah :
                        </label>
                        <Controller
                            name="pangkat_kepala"
                            control={control}
                            rules={{ required: "Pangkat Kepala Perangkat Daerah harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="pangkat_kepala"
                                        type="text"
                                        placeholder="masukkan Pangkat Kepala Perangkat Daerah"
                                    />
                                    {errors.pangkat_kepala ?
                                        <h1 className="text-red-500 text-xs mt-1">{errors.pangkat_kepala.message}</h1>
                                        :
                                        <h1 className="text-slate-300 text-xs mt-1">*Pangkat Kepala Perangkat Daerah Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>

                    {/* --- LEMBAGA --- */}
                    <div className="flex flex-col py-3">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="id_lembaga">
                            Lembaga:
                        </label>
                        <Controller
                            name="id_lembaga"
                            control={control}
                            rules={{ required: "Lembaga Harus Terisi" }}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Pilih Lembaga"
                                        options={OpdOption}
                                        isLoading={IsLoading}
                                        isSearchable
                                        isClearable
                                        onMenuOpen={() => {
                                            if (OpdOption.length === 0) {
                                                fetchLembaga();
                                            }
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                                padding: '2px'
                                            })
                                        }}
                                    />
                                    {errors.id_lembaga ?
                                        <h1 className="text-red-500 text-xs mt-1">{errors.id_lembaga.message}</h1>
                                        :
                                        <h1 className="text-slate-300 text-xs mt-1">*Lembaga Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>

                    <ButtonGreen type="submit" className="my-4">
                        Simpan
                    </ButtonGreen>
                    <ButtonRed type="button" halaman_url="/dataMaster/masterOpd">
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
    )
}
export const FormEditMasterOpd = () => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Start loading true
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [idNull, setIdNull] = useState<boolean>(false);
    const { id } = useParams();
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const router = useRouter();
    const token = getToken();

    const fetchLembaga = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/lembaga/findall`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            const result: ApiResponse<Lembaga[]> = await response.json();
            const opdOptions = result.data.map((item: Lembaga) => ({
                value: item.id,
                label: item.nama_lembaga,
            }));
            setOpdOption(opdOptions);
        } catch (err) {
            console.error('Failed to fetch lembaga:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchIdOpd = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/opd/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                
                // --- FIX: Applying specific types to the response
                const result: ApiResponse<OpdDetail> = await response.json();

                if (result.code == 500 || !result.data) {
                    setIdNull(true);
                } else {
                    const data = result.data;
                    // --- BEST PRACTICE: Reset the form with all data at once
                    reset({
                        kode_opd: data.kode_opd,
                        nama_opd: data.nama_opd,
                        nama_kepala_opd: data.nama_kepala_opd,
                        nip_kepala_opd: data.nip_kepala_opd,
                        pangkat_kepala: data.pangkat_kepala,
                        id_lembaga: {
                            value: data.id_lembaga.id,
                            label: data.id_lembaga.nama_lembaga
                        }
                    });
                }
            } catch (err) {
                console.error("Failed to fetch OPD detail:", err);
                setError('gagal mendapatkan data, periksa koneksi internet atau database server')
            } finally {
                setLoading(false);
            }
        }
        fetchIdOpd();
    }, [id, reset, token]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            kode_opd: data.kode_opd,
            nama_opd: data.nama_opd,
            nama_kepala_opd: data.nama_kepala_opd,
            nip_kepala_opd: data.nip_kepala_opd,
            pangkat_kepala: data.pangkat_kepala,
            id_lembaga: data.id_lembaga?.value,
        };
        try {
            const response = await fetch(`${API_URL}/opd/update/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil memperbarui data master perangkat daerah", "success", 1000);
                router.push("/dataMaster/masterOpd");
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch (err) {
            console.error("Update failed:", err);
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        }
    };

    if (loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit OPD :</h1>
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } 
    
    if (error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit OPD :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error}</h1>
            </div>
        )
    } 
    
    if (idNull) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit OPD :</h1>
                <h1 className="text-red-500 mx-5 py-5">ID tidak ditemukan</h1>
            </div>
        )
    } 
    
    // --- JSX FOR EDIT FORM (Similar to ADD FORM, so I've copied and adjusted)
    return (
        <>
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit OPD :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    {/* All form fields are similar to the create form, so I'll just show one for brevity */}
                    <div className="flex flex-col py-3">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="kode_opd">
                            Kode Perangkat Daerah :
                        </label>
                        <Controller
                            name="kode_opd"
                            control={control}
                            rules={{ required: "Kode Perangkat Daerah harus diisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="kode_opd"
                                        type="text"
                                        placeholder="masukkan Kode Perangkat Daerah"
                                    />
                                    {errors.kode_opd ?
                                        <h1 className="text-red-500 text-xs mt-1">{errors.kode_opd.message}</h1>
                                        :
                                        <h1 className="text-slate-300 text-xs mt-1">*Kode Perangkat Daerah Harus Diisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>

                    {/* --- NAMA OPD --- */}
                    <div className="flex flex-col py-3">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="nama_opd">
                            Nama Perangkat Daerah :
                        </label>
                        <Controller
                            name="nama_opd"
                            control={control}
                            rules={{ required: "Nama Perangkat Daerah harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_opd"
                                        type="text"
                                        placeholder="masukkan Nama Perangkat Daerah"
                                    />
                                    {errors.nama_opd ?
                                        <h1 className="text-red-500 text-xs mt-1">{errors.nama_opd.message}</h1>
                                        :
                                        <h1 className="text-slate-300 text-xs mt-1">*Nama OPD Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    
                    {/* --- NAMA KEPALA OPD --- */}
                    <div className="flex flex-col py-3">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="nama_kepala_opd">
                            Nama Kepala Perangkat Daerah:
                        </label>
                        <Controller
                            name="nama_kepala_opd"
                            control={control}
                            rules={{ required: "Nama Kepala harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_kepala_opd"
                                        type="text"
                                        placeholder="masukkan Nama Kepala Perangkat Daerah"
                                    />
                                    {errors.nama_kepala_opd ?
                                        <h1 className="text-red-500 text-xs mt-1">{errors.nama_kepala_opd.message}</h1>
                                        :
                                        <h1 className="text-slate-300 text-xs mt-1">*Nama Kepala Perangkat Daerah Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>

                    {/* --- NIP KEPALA OPD --- */}
                    <div className="flex flex-col py-3">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="nip_kepala_opd">
                             NIP Kepala Perangkat Daerah :
                        </label>
                        <Controller
                            name="nip_kepala_opd"
                            control={control}
                            rules={{ required: "NIP Kepala Perangkat Daerah harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nip_kepala_opd"
                                        type="text"
                                        placeholder="masukkan NIP Kepala"
                                    />
                                    {errors.nip_kepala_opd ?
                                        <h1 className="text-red-500 text-xs mt-1">{errors.nip_kepala_opd.message}</h1>
                                        :
                                        <h1 className="text-slate-300 text-xs mt-1">*NIP Kepala Perangkat Daerah Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>

                    {/* --- PANGKAT KEPALA --- */}
                    <div className="flex flex-col py-3">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="pangkat_kepala">
                             Pangkat Kepala Perangkat Daerah :
                        </label>
                        <Controller
                            name="pangkat_kepala"
                            control={control}
                            rules={{ required: "Pangkat Kepala Perangkat Daerah harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="pangkat_kepala"
                                        type="text"
                                        placeholder="masukkan Pangkat Kepala Perangkat Daerah"
                                    />
                                    {errors.pangkat_kepala ?
                                        <h1 className="text-red-500 text-xs mt-1">{errors.pangkat_kepala.message}</h1>
                                        :
                                        <h1 className="text-slate-300 text-xs mt-1">*Pangkat Kepala Perangkat Daerah Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>

                    {/* --- LEMBAGA --- */}
                    <div className="flex flex-col py-3">
                        <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="id_lembaga">
                            Lembaga:
                        </label>
                        <Controller
                            name="id_lembaga"
                            control={control}
                            rules={{ required: "Lembaga Harus Terisi" }}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Pilih Lembaga"
                                        options={OpdOption}
                                        isLoading={IsLoading}
                                        isSearchable
                                        isClearable
                                        onMenuOpen={() => {
                                            if (OpdOption.length === 0) {
                                                fetchLembaga();
                                            }
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                                padding: '2px'
                                            })
                                        }}
                                    />
                                    {errors.id_lembaga ?
                                        <h1 className="text-red-500 text-xs mt-1">{errors.id_lembaga.message}</h1>
                                        :
                                        <h1 className="text-slate-300 text-xs mt-1">*Lembaga Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>

                    <ButtonGreen type="submit" className="my-4">
                        Update
                    </ButtonGreen>
                    <ButtonRed type="button" halaman_url="/dataMaster/masterOpd">
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
    )
}

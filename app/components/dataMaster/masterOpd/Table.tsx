'use client'

import { ButtonGreen, ButtonRed } from "@/app/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/app/components/global/Alert";
import { useState, useEffect } from "react";
import { LoadingClip } from "@/app/components/global/Loading";
import { getToken } from "@/app/components/lib/Cookie";

// interface opd {
//     id: string;
//     kode_opd: string;
//     nama_opd: string;
//     singkatan: string;
//     alamat: string;
//     telepon: string;
//     fax: string;
//     email: string;
//     website: string;
//     nama_kepala_opd: string;
//     nip_kepala_opd: string;
//     pangkat_kepala: string;
//     id_lembaga: lembaga;
// }
type opd = {
  no: number;
  kode_perangkat_daerah: string;
  nama_perangkat_daerah: string;
  nama_kepala_perangkat_daerah: string;
  nip_kepala_perangkat_daerah: string;
  pangkat_kepala_perangkat_daerah: string;
  kode_lembaga: string;
};

interface lembaga {
    id: string;
    nama_lembaga: string;
    is_active: boolean; 
}
const DataDummy =
    [
  {
    "id": 1,
    "kode_perangkat_daerah": "1.01.22.00.00.1.0001",
    "nama_perangkat_daerah": "Dinas Pendidikan dan Kebudayaan",
    "nama_kepala_perangkat_daerah": "Dra. Siti Zubaidah, M.H.",
    "nip_kepala_perangkat_daerah": "19780709 198808 2 001",
    "pangkat_kepala_perangkat_daerah": "Pembina Utama Muda",
    "kode_lembaga": "LMBG-c0f0"
  },
  {
    "id": 2,
    "kode_perangkat_daerah": "1.02.00.00.0.1.0002",
    "nama_perangkat_daerah": "Dinas Kesehatan",
    "nama_kepala_perangkat_daerah": "Agung Tri Widodo, S.KM",
    "nip_kepala_perangkat_daerah": "19850320 198803 1 006",
    "pangkat_kepala_perangkat_daerah": "Pembina Utama Muda",
    "kode_lembaga": "LMBG-c0f0"
  },
  {
    "id": 3,
    "kode_perangkat_daerah": "1.02.00.00.0.1.0003",
    "nama_perangkat_daerah": "Puskesmas Kebonsari",
    "nama_kepala_perangkat_daerah": "dr. Sarjana Rahadi",
    "nip_kepala_perangkat_daerah": "19860118 198603 1 003",
    "pangkat_kepala_perangkat_daerah": "Penata Tingkat I",
    "kode_lembaga": "LMBG-c0f0"
  },
  {
    "id": 4,
    "kode_perangkat_daerah": "1.02.00.00.0.1.0004",
    "nama_perangkat_daerah": "Puskesmas Gantungan",
    "nama_kepala_perangkat_daerah": "drg. Rugama Tungowo Kuswoyo",
    "nip_kepala_perangkat_daerah": "19741213 200501 1 004",
    "pangkat_kepala_perangkat_daerah": "Penata Tingkat I",
    "kode_lembaga": "LMBG-c0f0"
  },
  {
    "id": 5,
    "kode_perangkat_daerah": "1.02.00.00.0.1.0005",
    "nama_perangkat_daerah": "Puskesmas Geger",
    "nama_kepala_perangkat_daerah": "drg. Sunu Setyowati",
    "nip_kepala_perangkat_daerah": "19850423 200503 2 006",
    "pangkat_kepala_perangkat_daerah": "Penata Tingkat I",
    "kode_lembaga": "LMBG-c0f0"
  },
  {
    "id": 6,
    "kode_perangkat_daerah": "1.02.00.00.0.1.0006",
    "nama_perangkat_daerah": "Puskesmas Kaibon",
    "nama_kepala_perangkat_daerah": "drg. Dyah Ariana Darmayani",
    "nip_kepala_perangkat_daerah": "19801201 201001 2 008",
    "pangkat_kepala_perangkat_daerah": "Penata Tingkat I",
    "kode_lembaga": "LMBG-c0f0"
  },
  {
    "id": 7,
    "kode_perangkat_daerah": "1.02.00.00.0.1.0007",
    "nama_perangkat_daerah": "Puskesmas Millir",
    "nama_kepala_perangkat_daerah": "drg. Cukup Wibowo",
    "nip_kepala_perangkat_daerah": "19870301 201201 1 001",
    "pangkat_kepala_perangkat_daerah": "Penata Tingkat I",
    "kode_lembaga": "LMBG-c0f0"
  }

]
const Table = () => {
    const [Opd, setOpd] = useState<opd[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();

    // useEffect(() => {
    //     const API_URL = process.env.NEXT_PUBLIC_API_URL;
    //     const fetchOpd = async() => {
    //         setLoading(true)
    //         try{
    //             const response = await fetch(`${API_URL}/opd/findall`, {
    //                 headers: {
    //                     Authorization: `${token}`,
    //                     'Content-Type': 'application/json',
    //                   },
    //             });
    //             const result = await response.json();
    //             const data = result.data;
    //             if(data == null){
    //                 setDataNull(true);
    //                 setOpd([]);
    //             } else if(result.code === 401){
    //                 setError(true);
    //             } else {
    //                 setDataNull(false);
    //                 setOpd(data);
    //                 setError(false);
    //             }
    //             setOpd(data);
    //         } catch(err){
    //             setError(true);
    //             console.error(err)
    //         } finally{
    //             setLoading(false);
    //         }
    //     }
    //     fetchOpd();
    // }, [token]);

    const hapusOpd = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/opd/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                  },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            setOpd(Opd.filter((data) => (data.no !== id)))

            AlertNotification("Berhasil", "Data Perangkat Daerah Berhasil Dihapus", "success", 1000);
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if(Loading){
        return (    
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(Error){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    }

    return(
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
  <tr className="bg-[#99CEF5] text-white">
    <th className="border-r border-b px-6 py-3">No</th>
    <th className="border-r border-b px-6 py-3">Kode Perangkat Daerah</th>
    <th className="border-r border-b px-6 py-3">Nama Perangkat Daerah</th>
    <th className="border-r border-b px-6 py-3">Nama Kepala Perangkat Daerah</th>
    <th className="border-r border-b px-6 py-3">NIP Kepala Perangkat Daerah</th>
    <th className="border-r border-b px-6 py-3">Pangkat Kepala Perangkat Daerah</th>
    <th className="border-b px-6 py-3">Kode Lembaga</th>
  </tr>
</thead>
<tbody>
  {DataDummy.map((r) => (
    <tr key={r.id} className="border-t">
      <td className="border-r border-b px-6 py-4">{r.id}</td>
      <td className="border-r border-b px-6 py-4">{r.kode_perangkat_daerah}</td>
      <td className="border-r border-b px-6 py-4">{r.nama_perangkat_daerah}</td>
      <td className="border-r border-b px-6 py-4">{r.nama_kepala_perangkat_daerah}</td>
      <td className="border-r border-b px-6 py-4">{r.nip_kepala_perangkat_daerah}</td>
      <td className="border-r border-b px-6 py-4">{r.pangkat_kepala_perangkat_daerah}</td>
      <td className="border-b px-6 py-4">{r.kode_lembaga}</td>
    </tr>
  ))}
</tbody>

                    {/* <tbody>
                    {DataNull ? 
                        <tr>
                            <td className="px-6 py-3 uppercase" colSpan={13}>
                                Data Kosong / Belum Ditambahkan
                            </td>
                        </tr>
                    :
                        Opd.map((data, index) => (
                        <tr key={data.id}>
                            <td className="border-r border-b px-6 py-4">{index + 1}</td>
                            <td className="border-r border-b px-6 py-4">{data.kode_opd ? data.kode_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.nama_opd ? data.nama_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.nama_kepala_opd ? data.nama_kepala_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.nip_kepala_opd ? data.nip_kepala_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.pangkat_kepala ? data.pangkat_kepala : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.id_lembaga ? data.id_lembaga.id : "-"}</td>
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col jutify-center items-center gap-2">
                                    <ButtonGreen className="w-full" halaman_url={`/DataMaster/masteropd/${data.id}`}>Edit</ButtonGreen>
                                    <ButtonRed 
                                        className="w-full"
                                        onClick={() => {
                                            AlertQuestion("Hapus?", "Hapus Perangkat Daerah yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                if(result.isConfirmed){
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
                    </tbody> */}
                </table>
            </div>
        </>
    )
}

export default Table;
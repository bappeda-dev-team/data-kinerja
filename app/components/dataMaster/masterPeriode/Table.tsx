'use client';

import React, { useEffect, useState } from 'react';
import { ButtonSky } from '@/app/components/global/Button';
import { LoadingClip } from '@/app/components/global/Loading';
import { AlertNotification } from '@/app/components/global/Alert';
import { getSessionId } from '@/app/components/lib/Cookie';
import { TbPencil, TbTrash, TbPlus } from 'react-icons/tb';
import { ModalPeriode } from './ModalPeriode';

type Periode = {
  id: number;
  tahun_awal: string | number;
  tahun_akhir: string | number;
  jenis_periode: string;
};

// TODO: gunakan value dari NEXT_PUBLIC_API
const ENDPOINT = {
  FIND_ALL: 'https://testapi.kertaskerja.cc/api/v1/perencanaan/periode/findall',
  DELETE: (id: number) =>
    `https://testapi.kertaskerja.cc/api/v1/perencanaan/periode/delete/${id}`,
};

// Headers builder: selalu valid, dan pakai Bearer
// semua request pakai X-Session-Id untuk authorization
// kecuali login
const buildHeaders = (rawToken: string): HeadersInit => {
  const h = new Headers();
  h.set('Accept', 'application/json');
  h.set('Content-Type', 'application/json');
  // ambil dari cookies.tsx, di localstorage sessionId
  h.set('X-Session-Id', rawToken);
  // TODO hapus if dibawah
  // if (rawToken) h.set('Authorization', `Bearer ${rawToken}`);
  return h;
};

const Table = () => {
  const [rows, setRows] = useState<Periode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ambil token; fallback ke sessionId kalau kamu memang simpan itu
  const authToken = getSessionId();

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINT.FIND_ALL, {
        headers: buildHeaders(authToken),
        cache: 'no-store',
      });

      const ct = res.headers.get('content-type') || '';
      const raw = await res.text();

      // Kalau server redirect/401 → biasanya balas HTML
      if (!ct.includes('application/json')) {
        console.error('Non-JSON response', { status: res.status, raw: raw.slice(0, 200) });
        throw new Error('Non-JSON response');
      }

      if (!res.ok) {
        console.error('!res.ok', res.status, raw.slice(0, 200));
        throw new Error(`HTTP ${res.status}`);
      }

      const payload = JSON.parse(raw);
      const data: any[] = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
        ? payload
        : [];

      setRows(
        data.map((d: any) => ({
          id: Number(d.id),
          tahun_awal: d.tahun_awal,
          tahun_akhir: d.tahun_akhir,
          jenis_periode: d.jenis_periode ?? 'RPJMD',
        }))
      );
    } catch (e) {
      setRows([]);
      setError('Periksa koneksi / server API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<Periode | null>(null);

  const onOpenCreate = () => setOpenCreate(true);
  const onOpenEdit = (row: Periode) => {
    setCurrentRow(row);
    setOpenEdit(true);
  };

  const onDelete = async (id: number) => {
    if (!confirm('Hapus data periode ini?')) return;
    try {
      const res = await fetch(ENDPOINT.DELETE(id), {
        method: 'DELETE',
        headers: buildHeaders(authToken),
      });
      const body = await res.text();
      if (!res.ok) {
        console.error('Delete failed:', res.status, body.slice(0, 200));
        AlertNotification('Gagal', 'Gagal menghapus data (response !ok).', 'error', 1800);
        return;
      }
      AlertNotification('Berhasil', 'Data Periode dihapus', 'success', 1000);
      fetchAll();
    } catch (err) {
      AlertNotification('Gagal', 'Cek koneksi internet / server API', 'error', 1800);
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
        <h1 className="text-red-500 font-bold mx-5 py-5">{error}</h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b px-5 py-5">
        <h1 className="uppercase font-bold">Data Master Periode</h1>
        <ButtonSky onClick={onOpenCreate}>
          <TbPlus className="mr-1" />
          Tambah Periode
        </ButtonSky>
      </div>

      <div className="overflow-auto m-2 rounded-t-xl border">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-500 text-white">
              <th className="border-r border-b py-3 text-center">No</th>
              <th className="border-r border-b px-6 py-3 min-w-[100px]">Tahun Awal</th>
              <th className="border-r border-b px-6 py-3 min-w-[100px]">Tahun Akhir</th>
              <th className="border-r border-b px-6 py-3 min-w-[120px]">Jenis Periode</th>
              <th className="border-b px-6 py-3 min-w-[160px] text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  Belum ada data
                </td>
              </tr>
            ) : (
              rows.map((item, idx) => (
                <tr key={item.id}>
                  <td className="border-r border-b px-6 py-4 text-center">{idx + 1}</td>
                  <td className="border-r border-b px-6 py-4 text-center">{item.tahun_awal}</td>
                  <td className="border-r border-b px-6 py-4 text-center">{item.tahun_akhir}</td>
                  <td className="border-r border-b px-6 py-4 text-center">{item.jenis_periode}</td>
                  <td className="border-b px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onOpenEdit(item)}
                        className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1"
                        title="Edit"
                      >
                        <TbPencil />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 flex items-center gap-1"
                        title="Hapus"
                      >
                        <TbTrash />
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* MODAL TAMBAH */}
        <ModalPeriode
          metode="baru"
          isOpen={openCreate}
          onClose={() => setOpenCreate(false)}
          onSuccess={() => {
            setOpenCreate(false);
            fetchAll();
          }}
        />

        {/* MODAL EDIT */}
        <ModalPeriode
          metode="lama"
          isOpen={openEdit}
          onClose={() => {
            setOpenEdit(false);
            setCurrentRow(null);
          }}
          current={currentRow || undefined}
          onSuccess={() => {
            setOpenEdit(false);
            setCurrentRow(null);
            fetchAll();
          }}
        />
      </div>
    </>
  );
};

export default Table;

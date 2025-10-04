'use client';

import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ButtonSky, ButtonRed } from '@/app/components/global/Button';
import { getToken, getCookie } from '@/app/components/lib/Cookie';
import { LoadingButtonClip } from '@/app/components/global/Loading';
import { AlertNotification } from '@/app/components/global/Alert';

type FormValue = {
  tahun_awal: string;
  tahun_akhir: string;
  jenis_periode: string;
};
type PeriodeRow = {
  id: number;
  tahun_awal: string | number;
  tahun_akhir: string | number;
  jenis_periode: string;
};
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  metode: 'lama' | 'baru';
  current?: PeriodeRow;
  onSuccess: () => void;
}

const ENDPOINT = {
  CREATE: 'https://testapi.kertaskerja.cc/api/v1/perencanaan/periode/create',
  UPDATE: (id: number) =>
    `https://testapi.kertaskerja.cc/api/v1/perencanaan/periode/update/${id}`,
};

const buildHeaders = (rawToken?: string | null): HeadersInit => {
  const h = new Headers();
  h.set('Content-Type', 'application/json');
  h.set('Accept', 'application/json');
  if (rawToken) h.set('Authorization', `Bearer ${rawToken}`);
  return h;
};

export const ModalPeriode: React.FC<ModalProps> = ({ isOpen, onClose, metode, current, onSuccess }) => {
  const { control, handleSubmit, reset } = useForm<FormValue>();
  const authToken = getToken() || getCookie('sessionId') || null;
  const [proses, setProses] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (metode === 'lama' && current) {
      reset({
        tahun_awal: String(current.tahun_awal ?? ''),
        tahun_akhir: String(current.tahun_akhir ?? ''),
        jenis_periode: current.jenis_periode || 'RPJMD',
      });
    } else {
      reset({ tahun_awal: '', tahun_akhir: '', jenis_periode: 'RPJMD' });
    }
  }, [isOpen, metode, current, reset]);

  const onSubmit: SubmitHandler<FormValue> = async (form) => {
    try {
      setProses(true);

      const payload = {
        tahun_awal: String(form.tahun_awal),
        tahun_akhir: String(form.tahun_akhir),
        jenis_periode: form.jenis_periode || 'RPJMD',
      };

      let url = ENDPOINT.CREATE;
      let method: 'POST' | 'PUT' = 'POST';
      if (metode === 'lama') {
        if (!current?.id) {
          AlertNotification('Gagal', 'ID periode tidak ditemukan untuk update', 'error', 1800);
          return;
        }
        url = ENDPOINT.UPDATE(current.id);
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: buildHeaders(authToken),
        body: JSON.stringify(payload),
      });

      const body = await res.text();
      if (!res.ok) {
        console.error('Save error:', res.status, body.slice(0, 200));
        AlertNotification('Gagal', 'Backend menolak permintaan. Cek payload/otorisasi.', 'error', 2000);
        return;
      }

      AlertNotification('Berhasil', `Periode berhasil ${metode === 'baru' ? 'ditambahkan' : 'diubah'}`, 'success', 1200);
      onSuccess();
    } catch (e) {
      console.error(e);
      AlertNotification('Gagal', 'Cek koneksi internet / server API', 'error', 1800);
    } finally {
      setProses(false);
    }
  };

  const handleClose = () => {
    onClose();
    reset({ tahun_awal: '', tahun_akhir: '', jenis_periode: 'RPJMD' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
      <div className="bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto">
        <div className="w-max-[500px] py-2 border-b">
          <h1 className="text-xl uppercase text-center">{metode === 'baru' ? 'Tambah' : 'Edit'} Periode</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mx-5 py-5">
          <div className="flex flex-col py-3">
            <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="tahun_awal">Tahun Awal</label>
            <Controller name="tahun_awal" control={control} rules={{ required: 'Tahun awal wajib diisi' }} render={({ field }) => (
              <input {...field} className="border px-4 py-2 rounded-lg" id="tahun_awal" type="text" placeholder="Masukkan Tahun Awal" />
            )}/>
          </div>

          <div className="flex flex-col py-3">
            <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="tahun_akhir">Tahun Akhir</label>
            <Controller name="tahun_akhir" control={control} rules={{ required: 'Tahun akhir wajib diisi' }} render={({ field }) => (
              <input {...field} className="border px-4 py-2 rounded-lg" id="tahun_akhir" type="text" placeholder="Masukkan Tahun Akhir" />
            )}/>
          </div>

          <div className="flex flex-col py-3">
            <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="jenis_periode">Jenis Periode</label>
            <Controller name="jenis_periode" control={control} render={({ field }) => (
              <input {...field} className="border px-4 py-2 rounded-lg" id="jenis_periode" type="text" placeholder="RPJMD" />
            )}/>
          </div>

          <ButtonSky className="w-full mt-3" type="submit" disabled={proses}>
            {proses ? (<span className="flex"><LoadingButtonClip />Menyimpan...</span>) : 'Simpan'}
          </ButtonSky>
          <ButtonRed className="w-full my-2" onClick={handleClose} type="button" disabled={proses}>Batal</ButtonRed>
        </form>
      </div>
    </div>
  );
};

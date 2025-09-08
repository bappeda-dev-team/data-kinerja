'use client';

import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Select from 'react-select';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface OptionType {
  value: string;
  label: string;
}

interface FormValue {
  jenis_data: string;
  tahun: OptionType | null;
}

const AddDataModal = ({ isOpen, onClose }: ModalProps) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: {
      jenis_data: '',
      tahun: null,
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
  const yearOptions: OptionType[] = years.map(year => ({ value: year, label: year }));

  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    setIsSubmitting(true);
    
    const payload = {
      jenis_data: data.jenis_data,
      tahun: data.tahun?.value,
    };
    
    console.log("Data yang akan dikirim ke backend:", payload);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    alert('Data berhasil disimpan! Cek console log.');
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b">
          <h3 className="text-xl font-bold text-center text-gray-800">
            TAMBAH JENIS DATA
          </h3>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="jenis_data" className="block text-sm font-bold text-gray-700 mb-2">
                  JENIS DATA:
                </label>
                <Controller
                  name="jenis_data"
                  control={control}
                  rules={{ required: 'Jenis data tidak boleh kosong' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="jenis_data"
                      type="text"
                      placeholder="Masukkan Nama Data"
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition ${errors.jenis_data ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    />
                  )}
                />
                {errors.jenis_data && <p className="text-red-500 text-sm mt-1">{errors.jenis_data.message}</p>}
              </div>
              <div>
                <label htmlFor="tahun" className="block text-sm font-bold text-gray-700 mb-2">
                  TAHUN:
                </label>
                <Controller
                  name="tahun"
                  control={control}
                  rules={{ required: 'Tahun tidak boleh kosong' }}
                  render={({ field }) => (
                     <Select
                        {...field}
                        inputId="tahun"
                        options={yearOptions}
                        placeholder="Pilih Tahun"
                        isClearable
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                padding: '0.30rem',
                                borderRadius: '0.375rem',
                                borderColor: errors.tahun ? 'rgb(239 68 68)' : '#D1D5DB',
                                '&:hover': {
                                    borderColor: errors.tahun ? 'rgb(239 68 68)' : '#D1D5DB',
                                },
                                boxShadow: state.isFocused ? (errors.tahun ? '0 0 0 2px rgb(254 202 202)' : '0 0 0 2px rgb(191 219 254)') : 'none',
                            }),
                        }}
                     />
                  )}
                />
                 {errors.tahun && <p className="text-red-500 text-sm mt-1">{errors.tahun.message}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-bold py-3 px-8 rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full font-bold py-3 px-8 rounded-lg text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition-opacity"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDataModal;

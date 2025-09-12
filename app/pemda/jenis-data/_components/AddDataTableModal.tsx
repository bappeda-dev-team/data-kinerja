'use client';

import React, { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Select from 'react-select';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jenisDataId: string; // ID dari halaman detail
};

interface OptionType {
  value: string;
  label: string;
}

interface FormValue {
  jenis_data_id: OptionType | null;
  nama_data: string;
  rumus_perhitungan: string;
  sumber_data: string;
  instansi_produsen_data: string;
  tahun: OptionType | null;
  satuan: string;
  target: string;
  keterangan: string;
}

const yearOptions: OptionType[] = Array.from({ length: 6 }, (_, i) => 2020 + i).map(year => ({
  value: String(year),
  label: String(year)
}));

const AddDataTableModal = ({ isOpen, onClose, onSuccess, jenisDataId }: ModalProps) => {
  const {
  handleSubmit,
  control,
  reset,
  setValue,
  formState: { errors },
} = useForm<FormValue>({
  defaultValues: {
    jenis_data_id: null,   // pastikan null dari awal
    nama_data: "",
    rumus_perhitungan: "",
    sumber_data: "",
    instansi_produsen_data: "",
    tahun: null,           // juga null dari awal
    satuan: "",
    target: "",
    keterangan: "",
  },
});


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jenisDataOptions, setJenisDataOptions] = useState<OptionType[]>([]);
  const [isLoadingJenisData, setIsLoadingJenisData] = useState(false);

  const fetchJenisData = async () => {
    setIsLoadingJenisData(true);
    try {
      const response = await fetch("https://alurkerja.zeabur.app/jenisdata");
      if (!response.ok) throw new Error('Gagal mengambil daftar jenis data');
      
      const result = await response.json();
      const options = result.data.map((item: any) => ({
        value: item.id.toString(),
        label: `${item.jenis_data}`
      }));
      setJenisDataOptions(options);

      // Set nilai default dropdown berdasarkan ID dari halaman detail
      const selectedOption = options.find((opt: OptionType) => opt.value === jenisDataId);
      if (selectedOption) {
        setValue("jenis_data_id", selectedOption);
      }

    } catch (error) {
      console.error("Fetch Jenis Data Error:", error);
    } finally {
      setIsLoadingJenisData(false);
    }
  };
  
  // Fetch data saat modal pertama kali dibuka
  useEffect(() => {
    if (isOpen) {
        fetchJenisData();
    }
  }, [isOpen]);


  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    setIsSubmitting(true);
    
    const payload = {
      nama_data: data.nama_data,
      rumus_perhitungan: data.rumus_perhitungan,
      sumber_data: data.sumber_data,
      instansi_produsen_data: data.instansi_produsen_data,
      keterangan: data.keterangan,
      jenis_data_id: parseInt(data.jenis_data_id!.value, 10),
      target: [
        {
          tahun: data.tahun!.value,
          satuan: data.satuan,
          target: data.target,
        }
      ]
    };

    try {
      const response = await fetch("https://alurkerja.zeabur.app/datakinerjapemda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Terjadi kesalahan pada server`);
      }

      alert("Data Kinerja berhasil disimpan!");
      onSuccess();
      handleClose();
    } catch (error: any) {
      alert(`Gagal menyimpan data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b"><h3 className="text-xl font-bold text-center text-gray-800">TAMBAH DATA KINERJA</h3></div>
            <div className="p-8">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <SelectField control={control} name="jenis_data_id" label="Jenis Data" options={jenisDataOptions} error={errors.jenis_data_id} isLoading={isLoadingJenisData} />
                        <InputField control={control} name="nama_data" label="Nama Data" error={errors.nama_data} />
                        <InputField control={control} name="rumus_perhitungan" label="Rumus Perhitungan" error={errors.rumus_perhitungan} isTextarea/>
                        <InputField control={control} name="sumber_data" label="Sumber Data" error={errors.sumber_data} />
                        <InputField control={control} name="instansi_produsen_data" label="Instansi Produsen Data" error={errors.instansi_produsen_data} />
                        <SelectField control={control} name="tahun" label="Tahun Target" options={yearOptions} error={errors.tahun} />
                        <InputField control={control} name="target" label="Nilai Target" error={errors.target} type="text" />
                        <InputField control={control} name="satuan" label="Satuan" error={errors.satuan} />
                        <InputField control={control} name="keterangan" label="Keterangan" error={errors.keterangan} isTextarea />
                    </div>
                    <div className="flex flex-col gap-4 mt-8">
                        <button type="submit" disabled={isSubmitting} className="w-full font-bold py-3 px-8 rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 transition-opacity disabled:opacity-50">
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button type="button" onClick={handleClose} className="w-full font-bold py-3 px-8 rounded-lg text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition-opacity">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

// --- Helper Components ---
const InputField = ({ control, name, label, error, isTextarea = false, type = "text" }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-2">{label}:</label>
        <Controller
            name={name}
            control={control}
            rules={{ required: `${label} tidak boleh kosong` }}
            render={({ field }) => (
                isTextarea ? (
                    <textarea {...field} id={name} placeholder={`Masukkan ${label}`} className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`} />
                ) : (
                    <input {...field} id={name} type={type} placeholder={`Masukkan ${label}`} className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`} />
                )
            )}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
);

const SelectField = ({ control, name, label, options, error, onMenuOpen, isLoading }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-2">{label}:</label>
        <Controller name={name} control={control} rules={{ required: `${label} tidak boleh kosong` }}
            render={({ field }) => (
                <Select
                    {...field}
                    inputId={name}
                    options={options}
                    placeholder={`Pilih ${label}`}
                    isClearable
                    isLoading={isLoading}
                    onMenuOpen={onMenuOpen}
                    styles={{
                        control: (base, state) => ({ ...base, padding: '0.30rem', borderRadius: '0.375rem', borderColor: error ? 'rgb(239 68 68)' : '#D1D5DB', '&:hover': { borderColor: error ? 'rgb(239 68 68)' : '#D1D5DB' }, boxShadow: state.isFocused ? (error ? '0 0 0 2px rgb(254 202 202)' : '0 0 0 2px rgb(191 219 254)') : 'none' }),
                    }}
                />
            )}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
);

export default AddDataTableModal;
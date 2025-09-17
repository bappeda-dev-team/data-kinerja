export interface TargetData {
  satuan: string;
  tahun: number;
  target: string | number;
}

export interface DataKinerja {
  id: number;
  nama_data: string;
  rumus_perhitungan: string;
  sumber_data: string;
  instansi_produsen_data: string;
  keterangan: string;
  tahun: number;
  target: TargetData[]; // sesuai struktur API
}
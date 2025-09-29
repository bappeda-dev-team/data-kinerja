import * as jwtDecoded from "jwt-decode";
import { AlertNotification } from "../global/Alert";

// Fungsi untuk menyimpan nilai ke cookies
export const setCookie = (name: string, value: any) => {
    document.cookie = `${name}=${value}; path=/;`;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    // Jika di server-side, kembalikan null atau nilai default lainnya
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (data.code === 200) {
      // console.log('data dari response : ,', data);
      const token = data.data.token;
      try {
        const decoded = jwtDecoded.jwtDecode(token);
        // Simpan token di cookie
        document.cookie = `token=${token}; path=/;`;
        document.cookie = `user=${JSON.stringify(decoded)}; path=/;`;
        AlertNotification("Login Berhasil", "" , "success", 1000)
        return true;
      } catch (decodeError) {
        AlertNotification("Login Gagal", `${data.data}` , "error", 1000)
        console.error('Error decoding token:', data.code);
        return false;
      }
    } else if (data.code === 400) {
        AlertNotification("Login Gagal", `${data.data}` , "error", 1000)
        return false;
      } else {
        console.log(`Login gagal: Status ${data.data}`);
        return false;
      }
    } catch (err) {
      AlertNotification("Login Gagal", "terdapat kesalahan server / koneksi internet" , "error", 2000)
      console.error('Login gagal dengan error:', err);
    return false;
  }
};

export const logout = () => {
  // Hapus token dari localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('opd');
  localStorage.removeItem('user');
  localStorage.removeItem('periode');

  // Hapus semua cookie yang terkait
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  document.cookie = 'opd=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';

  // Redirect ke halaman login
  window.location.href = '/login';
};

export const getUser = () => {
  const get_user = getCookie("user");
  if(get_user){
    return {
      user: JSON.parse(get_user)
    };
  }
}

export const getToken = () => {
  const get_Token = getCookie("token")
  if (get_Token) {
    return get_Token;
  }
  return null;
}

export const getOpdTahun = () => {
  const get_tahun = getCookie("tahun");
  const get_opd = getCookie("opd");

  if (get_tahun && get_opd) {
    return {
      tahun: JSON.parse(get_tahun),
      opd: JSON.parse(get_opd)
    };
  }

  if (get_tahun) {
    return { tahun: JSON.parse(get_tahun), opd: null };
  }

  if (get_opd) {
    return { tahun: null, opd: JSON.parse(get_opd) };
  }

  return { tahun: null, opd: null };
};

export const getPeriode = () => {
  const get_periode = getCookie("periode");

  if (get_periode) {
    return {
      periode: JSON.parse(get_periode)
    };
  } else {
    return { periode: null };
  }

};
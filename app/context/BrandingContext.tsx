'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getOpdTahun, getUser } from "@/app/components/lib/Cookie";

// ========================
// Types
// ========================
interface OptionType {
  value: number;
  label: string;
}

interface OptionTypeString {
  value: string;
  label: string;
}

interface BrandingContextType {
  title: string;
  clientName: string;
  logo: string;
  LoadingBranding: boolean;
  branding: {
    title: string;
    client: string;
    logo: string;
    api_perencanaan: string;
    api_permasalahan: string;
    api_csf: string;
    tahun: OptionType | null;
    opd: OptionTypeString | null;
    user: any;
  };
}

// ========================
// Env Config
// ========================
const appName = process.env.NEXT_PUBLIC_APP_NAME || "";
const clientName = process.env.NEXT_PUBLIC_CLIENT_NAME || "";
const logo = process.env.NEXT_PUBLIC_LOGO_URL || "";
const api_perencanaan = process.env.NEXT_PUBLIC_API_URL || "";
const api_csf = process.env.NEXT_PUBLIC_API_URL_CSF || "";
const api_permasalahan = process.env.NEXT_PUBLIC_API_URL_PERMASALAHAN || "";

// ========================
// Context Creation
// ========================
const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

// ========================
// Provider
// ========================
export function BrandingProvider({ children }: { children: ReactNode }) {
  const [Tahun, setTahun] = useState<OptionType | null>(null);
  const [SelectedOpd, setSelectedOpd] = useState<OptionTypeString | null>(null);
  const [User, setUser] = useState<any>(null);
  const [Loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const data = getOpdTahun();
    const fetchUser = getUser();

    if (data?.tahun) {
      setTahun({ value: data.tahun.value, label: data.tahun.label });
    }
    if (data?.opd) {
      setSelectedOpd({ value: data.opd.value, label: data.opd.label });
    }
    if (fetchUser?.user) {
      setUser(fetchUser.user);
    }

    setLoading(false);
  }, []);

  return (
    <BrandingContext.Provider
      value={{
        title: appName,
        clientName,
        logo,
        LoadingBranding: Loading,
        branding: {
          title: appName,
          client: clientName,
          logo,
          api_perencanaan,
          api_csf,
          api_permasalahan,
          tahun: Tahun,
          opd: SelectedOpd,
          user: User,
        },
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
}

// ========================
// Hook
// ========================
export function useBrandingContext() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBrandingContext must be used within a BrandingProvider");
  }
  return context;
}

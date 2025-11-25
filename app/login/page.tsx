'use client'

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { ButtonSky } from "@/app/components/global/Button";
import { LoadingButtonClip } from "@/app/components/global/Loading";
import { login } from "@/app/components/lib/Cookie";
import { useBrandingContext } from "@/app/context/BrandingContext";

interface FormValues {
    username: string;
    password: string;
}

const LoginPage = () => {
    const { handleSubmit } = useForm<FormValues>();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [Proses, setProses] = useState<boolean>(false);
    const [errorLogin, setErrorLogin] = useState<string>("");

    const router = useRouter();
    const { branding } = useBrandingContext();

    const onSubmit = async () => {
        setProses(true);
        setErrorLogin("");

        try {
            await login(username, password);
            window.location.href = "/";
            // atau router.push("/");
        } catch (err: any) {
            // JANGAN console.error di sini, biar Next.js dev overlay nggak muncul
            const msg =
                err?.message && typeof err.message === "string"
                    ? err.message
                    : "Login gagal! Periksa NIP / Password.";
            setErrorLogin(msg);
        } finally {
            setProses(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-lg shadow-md w-96"
            >
                <div className="flex flex-col items-center">
                    <Image
                        src="https://logo.kertaskerja.cc/logo/kab-mahakam-ulu-2.png"
                        alt="logo"
                        width={90}
                        height={90}
                    />
                    <h1 className="text-2xl font-bold mt-3 text-center uppercase">
                        DATA KINERJA
                    </h1>
                    <h1 className="text-lg font-thin mb-6 text-center">
                        Kabupaten Mahakam Ulu
                    </h1>
                </div>

                {/* NIP */}
                <div className="mb-4">
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        NIP
                    </label>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Password
                    </label>
                    <div className="flex items-center justify-end">
                        <input
                            value={password}
                            type={!showPassword ? "password" : "text"}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        />
                        <button
                            type="button"
                            className="absolute mt-1 mr-3 text-sm"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <TbEye /> : <TbEyeClosed />}
                        </button>
                    </div>
                </div>

                {/* ALERT ERROR LOGIN */}
                {errorLogin && (
                    <div className="mb-4 p-3 text-sm rounded-md bg-red-100 text-red-700 border border-red-300">
                        {errorLogin}
                    </div>
                )}

                <ButtonSky
                    type="submit"
                    className="w-full"
                    disabled={Proses}
                >
                    {Proses ? (
                        <span className="flex">
                            <LoadingButtonClip />
                            Login...
                        </span>
                    ) : (
                        "Login"
                    )}
                </ButtonSky>
            </form>
        </div>
    );
};

export default LoginPage;

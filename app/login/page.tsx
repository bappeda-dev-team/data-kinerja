'use client'

import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
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

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [Proses, setProses] = useState<boolean>(false);
    const router = useRouter();

    const { branding } = useBrandingContext();

    const onSubmit = async (e: any) => {
        // e.preventDefault()
        setProses(true)

        try {
            await login(username, password)
            window.location.href = "/"
        } catch (err) {
            console.error(err)
        } finally {
            setProses(false)
        }
    }

    return (
        <>
            <div className="flex items-center justify-center w-full h-screen bg-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
                    <div className="flex flex-col items-center">
                        <Image
                            src="https://logo.kertaskerja.cc/logo/kab-mahakam-ulu-2.png"
                            alt="logo"
                            width={90}
                            height={90}
                        />

                        <h1 className="text-2xl font-bold mt-3 text-center uppercase">DATA KINERJA</h1>
                        <h1 className="text-lg font-thin mb-6 text-center">Kabupaten Mahakam Ulu</h1>
                    </div>
                    {/* NIP */}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
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
                        {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                    </div>
                    {/* PW */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>
                    {/* <select
                    className="w-full"
                    value={SelectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    <option value="">pilih role</option>
                    <option value="super_admin">super admin</option>
                    <option value="admin_opd">admin opd</option>
                    <option value="asn">asn</option>
                </select> */}
                    <ButtonSky
                        type="submit"
                        className="w-full"
                        disabled={Proses}
                    >
                        {Proses ?
                            <span className="flex">
                                <LoadingButtonClip />
                                Login...
                            </span>
                            :
                            "Login"
                        }
                    </ButtonSky>
                </form>
            </div>
        </>
    )
}

export default LoginPage;
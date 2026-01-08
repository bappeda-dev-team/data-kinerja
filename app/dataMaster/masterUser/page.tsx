import Table from "@/app/components/dataMaster/masterUser/Table";
import { FiHome } from "react-icons/fi";
import Link from "next/link";

const masteruser = () => {
    return(
        <>
            <div className="flex items-center mt-2">
                <Link href="/" className="mr-1"><FiHome /></Link>
                <p className="mr-1">/ Data Master /</p>
                <p className="mr-1 font-semibold text-gray-1200">Master User</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-col items-end">
                        <h1 className="uppercase font-bold">Daftar User</h1>
                    </div>
                    <div className="flex flex-col">
                        {/* <ButtonSky 
                            className="flex items-center justify-center"
                            halaman_url='/DataMaster/masteruser/tambah'
                        >
                            <TbCirclePlus className="mr-1"/>
                            Tambah User
                        </ButtonSky> */}
                    </div>
                </div>
                <Table />
            </div>
        </>
    )
}

export default masteruser;
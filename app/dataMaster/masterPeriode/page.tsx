'use client'

import { FiHome } from "react-icons/fi";
import Table from "@/app/components/dataMaster/masterPeriode/Table";
import { ButtonSky } from "@/app/components/global/Button";
import { TbPlus } from "react-icons/tb";

const MasterPeriode = () => {

    return(
        <>
            <div className="flex items-center mt-2">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Data Master /</p>
                <p className="mr-1 font-semibold text-gray-1200">Master Periode</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <Table />
            </div>
        </>
    )
}

export default MasterPeriode;
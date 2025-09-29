import { FiHome } from "react-icons/fi";
import { FormMasterOpd } from "@/app/components/dataMaster/masterOpd/FormMasterOpd";
import { Link } from "lucide-react";

const tambahOpd = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <Link href="/" className="mr-1"><FiHome /></Link>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master OPD</p>
                <p className="mr-1">/ Tambah</p>
            </div>
            <FormMasterOpd />
        </>
    )
}

export default tambahOpd;
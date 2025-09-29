import { FiHome } from "react-icons/fi";
import { FormMasterOpd } from "@/app/components/dataMaster/masterOpd/FormMasterOpd";

const tambahOpd = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
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
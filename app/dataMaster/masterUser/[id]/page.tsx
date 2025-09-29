import { FiHome } from "react-icons/fi";
import { FormEditUser } from "@/app/components/dataMaster/masterUser/FormUser";
import { Link } from "lucide-react";

const editUser = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <Link href="/" className="mr-1"><FiHome /></Link>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master User</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditUser />
        </>
    )
}

export default editUser;
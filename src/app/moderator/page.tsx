import Topnav from "@/components/Topnav"
import { LinkButtonOutline } from "../../components/Button"

export default function AdminDashboard() {

    return (
        <>
              <Topnav />
            <div className="w-full flex flex-col px-4 py-10 max-w-3xl mx-auto">
                
                <LinkButtonOutline linkto={`moderator/verify_members`} className="w-full mb-4" buttonText={'Verify Members (4)'} />

                <LinkButtonOutline linkto={`moderator/verify_changes`}  className="w-full" buttonText={'Verify Changes (8)'} />
            </div>
        </>
    )
}
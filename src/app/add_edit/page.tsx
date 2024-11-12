import { LinkButtonOutline, LinkButtonSolid } from "../../components/Button"

export default function AdminDashboard() {

    return (
        <div className="w-full flex flex-col px-6 py-10 max-w-3xl mx-auto">
            {/* <div className="w-full max-w-2xl h-60 rounded-[40px] bg-main_background border-y-2 border-r-2 border-border_active border-dashed">
                <div className="h-full bg-main_background w-8 "></div>
            </div>
            <div className="w-full max-w-2xl h-60 rounded-[40px] bg-main_background -mt-[2px] border-y-2 border-l-2 border-border_active border-dashed">
                <div className="h-full bg-main_background w-8 ml-auto mr-0"></div>
            </div>
            <div className="w-full max-w-2xl h-60 rounded-[40px] bg-main_background -mt-[2px] border-y-2 border-r-2 border-border_active border-dashed">
                <div className="h-full bg-main_background w-8 "></div>
            </div> */}
            
            <LinkButtonOutline linkto='add_edit/add_member' className="w-full" buttonText="Add Member" />
            <p className="text-text_color">You can edit member and also add some additional information over here</p>
            <LinkButtonOutline linkto='add_edit/edit_member'  className="w-full" buttonText="Edit Member" />
            <p className="text-text_color">Add all the members that not in this app before adding relationship</p>       
            <LinkButtonSolid linkto="add_edit/add_relationship" className="w-full" buttonText="Add Relationship" />
        </div>
    )
}
import { LinkButtonOutline, LinkButtonSolid } from "../../components/Button"

export default function AdminDashboard() {

    return (
        <div className="w-full flex flex-col gap-3 px-6 py-10 max-w-3xl mx-auto">
            <LinkButtonOutline linkto='add_edit/add_member' className="w-full" buttonText="Add Member" />
            <LinkButtonOutline linkto='add_edit/edit_member'  className="w-full" buttonText="Edit Member" />
            <p>First Add all the uses that not in this app</p>       
            <LinkButtonSolid linkto="add_edit/add_relationship" className="w-full" buttonText="Add Relationship" />
        </div>
    )
}
    // return (
    //     <form action={action} className="flex flex-col gap-2 px-4">
    //         <input className="border p-2" placeholder='Name' name='name' />
    //         {error?.name && <div className="text-red-500">{error?.name}</div>}
    //         <input className="border p-2" placeholder='Date Of Birth' name='birthday' type="date"/>
    //         {error?.birthday && <div className="text-red-500">{error?.birthday}</div>}
    //         <input className="border p-2" placeholder='Contact Number' name='contact_number' />
    //         {error?.contact_number && <div className="text-red-500">{error?.contact_number}</div>}
    //         <textarea className="border p-2" placeholder='Current Location' name='current_location' />
    //         {error?.current_location && <div className="text-red-500">{error?.current_location}</div>}
    //         <ButtonSolid type="submit" buttonText="submit" />
    //     </form>
    // )

    // create a user
    // add partner to user
    // add child to user

    // add partner to existing user
    // add child to existing user
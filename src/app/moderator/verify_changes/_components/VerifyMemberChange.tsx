
import Container from '@/components/Container';
import { HoldButton } from '@/components/HoldButton';
import { useToast } from '@/components/Toast';
import { CloseIcon, Condolences, Female2, Male2, Verified } from '@/utils/Icons';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export default function VerifyMemberChange({ data, openDetails }: any) {
    const toast = useToast();
    const router = useRouter();
    const token = getCookie('token');

    const handleDeleteRequest = async (memberId: number) => {
        try {
            const response = await fetch(`/api/moderator/verifyMember/${memberId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });
            const result = await response.json();

            // Handle 401 Unauthorized
            if (response.status === 401) {
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                router.push('/login');
                return;
            }
            // Handle API response
            if (!response.ok) {
                if (toast) {
                toast.show(result.error || "Something went wrong", "error", 5000);
                return;
                }
                throw new Error(result.error || "Something went wrong");
                // throw allows the error to be caught and handled by any surrounding `try...catch` blocks or global error handlers
            }
            if (toast) {
                toast.show(result.message, "success", 5000);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            if (toast) {
                toast.show("An error occurred. Please try again.", "error", 5000);
            } else {
                alert("An error occurred. Please try again.");
            }
        };
    }

    return (
        <Container className='text-text_color py-6 px-4 relative bg-main_background scroll-stable'>
            <div onClick={() => openDetails(false)} className='hidden md:block absolute top-0 right-0 border border-border_color rounded-md m-2 cursor-pointer'><CloseIcon /></div>
            <div className='flex gap-2 items-center w-full pb-6'>
                <div className='border border-border_color p-2 rounded-md relative'>
                    <Male2 />
                </div>
                <p className='text-lg font-semibold flex items-center'>
                    <span>Name Unavailable</span>
                    <span className='pl-2'><Verified /></span>
                </p>
            </div>
            <div className="text-text_color">
                <div className="flex gap-2">
                    <p className="whitespace-nowrap text-nowrap font-semibold">Name:</p>
                    <div className='flex flex-wrap'>
                        <p className='line-through opacity-55'>hello</p>
                        <p className='pl-2'>Hi hello</p>
                    </div>
                </div>
                <span className='border-b border-dashed border-border_color block w-full my-1'/>
                <div className="flex gap-2">
                    <p className="whitespace-nowrap text-nowrap font-semibold">Gender:</p>
                    <div className='flex flex-wrap'>
                        <p>Male</p>
                    </div>
                </div>
                <span className='border-b border-dashed border-border_color block w-full my-1'/>
                <div className="flex gap-2">
                    <p className="whitespace-nowrap text-nowrap font-semibold">Date of Birth:</p>
                    <div className='flex flex-wrap'>
                        <div className='line-through opacity-55'>
                            <span>15</span>
                            <span>/08</span>
                            <span>/1996</span>
                        </div>
                    </div>
                </div>
                <span className='border-b border-dashed border-border_color block w-full my-1'/>
                <div className="flex gap-2">
                    <p className="whitespace-nowrap text-nowrap font-semibold">Deceased:</p>
                    <div className='flex flex-wrap'>
                        <p>Yes</p>
                    </div>
                </div>
                <span className='border-b border-dashed border-border_color block w-full my-1'/>
                <div className="flex gap-2">
                    <p className="whitespace-nowrap text-nowrap font-semibold">Date of Death:</p>
                    <div className='flex flex-wrap'>
                        <div>
                            <span>15</span>
                            <span>/08</span>
                            <span>/1996</span>
                        </div>
                    </div>
                </div>
                <span className='border-b border-dashed border-border_color block w-full my-1'/>
                <div className="flex gap-2">
                    <p className="whitespace-nowrap text-nowrap font-semibold">Phone Number:</p>
                    <div className='flex flex-wrap'>
                        <p>0987654321**</p>
                    </div>
                </div>
                <span className='border-b border-dashed border-border_color block w-full my-1'/>
                <div className="flex gap-2">
                    <p className="whitespace-nowrap text-nowrap font-semibold">Occupation:</p>
                    <div className='flex flex-wrap'>
                        <p>Engineering</p>
                    </div>
                </div>
                <span className='border-b border-dashed border-border_color block w-full my-1'/>
                <div className="flex gap-2">
                    <p className="whitespace-nowrap text-nowrap font-semibold">Education:</p>
                    <div className='flex flex-wrap'>
                        <p>Math</p>
                    </div>
                </div>
                <span className='border-b border-dashed border-border_color block w-full my-1'/>
                <div className="flex gap-2">
                    <p className="whitespace-nowrap text-nowrap font-semibold">Address:</p>
                    <div>
                        <p className='line-through opacity-55'>20/3 1A4 Lalavallai Edalakudy post kanyakumari</p>
                        <p>20/3 1A4 Lalavallai Edalakudy post kanyakumari</p>
                    </div>
                </div>
                <span className='border-b border-dashed border-border_color block w-full my-1'/>
                <div className="flex gap-2 mb-1">
                    <p className="whitespace-nowrap text-nowrap font-semibold">Family Descent:</p>
                    <div className='flex flex-wrap'>
                        <p className='line-through opacity-55'>Yes</p>
                        <p className='pl-2'>No</p>
                    </div>
                </div>
                <div  className='border border-border_color rounded-md px-4 py-2'>
                    <div className="flex gap-2">
                        <p className="whitespace-nowrap text-nowrap font-semibold">Father:</p>
                        <div className='flex flex-wrap'>
                            <p>Math</p>
                        </div>
                    </div>
                    <span className='border-b border-dashed border-border_color block w-full my-1'/>
                    <div className="flex gap-2">
                        <p className="whitespace-nowrap text-nowrap font-semibold">Mother:</p>
                        <div className='flex flex-wrap'>
                            <p>Math</p>
                        </div>
                    </div>
                    <span className='border-b border-dashed border-border_color block w-full my-1'/>
                    <div className="flex gap-2">
                        <p className="whitespace-nowrap text-nowrap font-semibold">Siblings:</p>
                        <div className='flex flex-wrap'>
                            <p>Math</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col mt-4 gap-2'>
            <HoldButton buttonText='Approve changes' onClick={() => console.log("hi")}/>
            <HoldButton type='outline' buttonText='Reject changes' onClick={() => handleDeleteRequest(3)} />
            </div>
        </Container>
    );
}

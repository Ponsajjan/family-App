import Calender from "./Calender";
import dotenv from 'dotenv';
dotenv.config();

const page = () => {
    return (
        <>
            <Calender />
        </>
    );
};

export default page;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata = {
    title: "Family Calender",
    description:
        "Shared Family Calender For Birthdays & Remembrances",
    openGraph: {
        title: "Family Calender | Birthday & Remembrance Calender",
        description:
            "Shared Family Calender For Birthdays & Remembrances",
        url: `${baseUrl}`,
        type: "website",
        images: [{url:`${baseUrl}/native.jpg`, alt: 'Birthday & Remembrance Calender'}],
    },
    alternates: {
        canonical: `${baseUrl}`,
    },
};

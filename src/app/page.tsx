import Calender from "./Calender";

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
    title: "Family App",
    description:
        "Family digital Hub Shared Calender For Birthdays & Remembrances",
    openGraph: {
        title: "Family App | Birthdays & Remembrances Calender",
        description:
            "Family digital Hub Shared Calender For Birthdays & Remembrances",
        url: `${baseUrl}`,
        type: "website",
        images: [{url:`${baseUrl}/native.jpg`, alt: 'Stitchflow SaaS Management Platform'}],
    },
    alternates: {
        canonical: `${baseUrl}`,
    },
};

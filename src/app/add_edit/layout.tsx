import Topnav from "@/components/Topnav";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <div className="w-full">
            <Topnav>
            </Topnav>
            {children}
        </div>
    );
}
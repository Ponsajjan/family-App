import Topnav from "@/components/Topnav";
import MemberHeadProvider from "@/contexts/HeadContext";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <div className="w-full">
      <Topnav>
      </Topnav>
      <MemberHeadProvider>
        {children}
      </MemberHeadProvider>
    </div>
  );
}

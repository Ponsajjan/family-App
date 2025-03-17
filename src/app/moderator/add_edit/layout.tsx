import Topnav from "@/components/Topnav";
import { SearchIcon } from "@/utils/Icons";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full">
      <Topnav>
      </Topnav>
      {children}
    </div>
  );
}

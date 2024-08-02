import { Nav, NavLink } from "@/components/Nav";
export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <Nav>
            <NavLink href="/admin">Admin</NavLink>
            <NavLink href="/tree">Tree</NavLink>
            <NavLink href="/calender">Calender</NavLink>
            <NavLink href="/relatives">Relatives</NavLink>
        </Nav>
        <div className="container my-6">
            {children}
        </div>
    </div>
  );
}

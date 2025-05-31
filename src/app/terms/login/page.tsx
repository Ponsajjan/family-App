"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Topnav from "@/components/Topnav";
import { NextArrow } from "@/utils/Icons";
import { useAuth } from "@/contexts/AuthContext";
import { getCookie } from "cookies-next";
import Container from "@/components/Container";

export default function Page() {
    const router = useRouter();
    const [form, setForm] = useState({ password: "" });
    const [error, setError] = useState("");
    const token = getCookie('token');
    const {setAccess} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/moderator_login", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form),
            });
    
            const data = await res.json();
            if (data.newtoken) {
                document.cookie = `token=${data.newtoken}; path=/`;
                document.cookie = `access=moderator; path=/`;
                setAccess("moderator");
                router.push("/moderator");
            } else {
                setError(data.error);
            }
        } catch (error: any) {
            setError(error.error);
        }
    };

    return (
      <div className="w-full">
        <Topnav>
            <div className="ml-auto mr-0 w-[170px] hidden lg:block">
                <button 
                    className="group flex items-center text-sm text-text_color"
                    onClick={() => router.push("/moderator")}
                >
                    Preview as Moderator
                    <span className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-1.5">
                        <NextArrow />
                    </span>
                </button>
            </div>
        </Topnav>
        <Container>            
            <form onSubmit={handleSubmit} className="max-w-lg px-4 pt-10 mx-auto">
                <div className='flex h-12 border border-border_color bg-field_color opacity-85 rounded-md overflow-hidden px-2'>
                    <label className='flex items-center w-full'>
                        <input
                            onChange={(e) => {setForm({ ...form, password: e.target.value }); setError("")}}
                            required
                            placeholder='hello world!'
                            autoFocus
                            className={`py-3 px-1 outline-none text-text_color focus:border-border_active text-sm h-full w-full bg-transparent disabled:cursor-not-allowed`}
                        />
                    </label>
                    <button type='submit' className="py-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="auto" height="full" viewBox="0 0 32 32" version="1.1">
                        <path d="M7.744 19.189l-1.656 5.797c-0.019 0.062-0.029 0.133-0.029 0.207 0 0.413 0.335 0.748 0.748 0.748 0.001 0 0.001 0 0.002 0h-0c0.001 0 0.002 0 0.003 0 0.075 0 0.146-0.011 0.214-0.033l-0.005 0.001 5.622-1.656c0.124-0.037 0.23-0.101 0.315-0.186l-0 0 17.569-17.394c0.137-0.135 0.223-0.323 0.223-0.531v-0c0-0 0-0.001 0-0.001 0-0.207-0.084-0.395-0.219-0.531l-4.141-4.142c-0.136-0.136-0.324-0.22-0.531-0.22s-0.395 0.084-0.531 0.22v0l-17.394 17.394c-0.088 0.088-0.153 0.198-0.189 0.321l-0.001 0.005zM25.859 3.061l3.078 3.078-3.078 3.047-3.079-3.047zM21.72 7.2l3.073 3.041-12.756 12.628-4.133 1.217 1.229-4.299zM30 13.25c-0.414 0-0.75 0.336-0.75 0.75v0 15.25h-26.5v-26.5h15.25c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0h-16c-0.414 0-0.75 0.336-0.75 0.75v0 28c0 0.414 0.336 0.75 0.75 0.75h28c0.414-0 0.75-0.336 0.75-0.75v0-16c-0-0.414-0.336-0.75-0.75-0.75v0z"/>
                    </svg>
                    </button>
                </div>
                {error && <p className='text-text_color text-sm pl-1 pt-1'>{error}</p>}
            </form>
        </Container>
      </div>
    )
}

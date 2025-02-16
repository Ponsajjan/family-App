"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topnav from "@/components/Topnav";

export default function Page() {
    const router = useRouter();
    const [form, setForm] = useState({ password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
    
            const data = await res.json();
            if (data.token) {
                document.cookie = `token=${data.token}; path=/`;
                router.push("/");
            } else {
                setError(data.error);
            }
        } catch (error: any) {
            console.error(error.error);
        }
    };

    return (
      <div className="w-full">
        <Topnav>
        </Topnav>
        <div className='flex flex-col md:flex-row justify-center items-center w-full h-[calc(100vh-3rem)] max-w-4xl mx-auto overflow-auto px-4 py-6'>            
            <div className='w-full max-w-80'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" version="1.1">
                <path d="M3,25h8c0.553,0,1-0.447,1-1v-1.595c0.935,0.375,1.941,0.575,2.979,0.575c1.8,0,3.505-0.596,4.902-1.685l1.463,1.463l0,0   c-0.346,0.346-0.391,0.891-0.106,1.288l3.536,4.949c0.032,0.045,0.067,0.087,0.106,0.126c0.585,0.585,1.353,0.877,2.121,0.877   s1.536-0.292,2.121-0.877c1.17-1.17,1.17-3.072,0-4.242c-0.039-0.039-0.081-0.074-0.126-0.106l-4.949-3.536   c-0.397-0.284-0.942-0.24-1.288,0.106l0,0l-1.463-1.463c1.089-1.397,1.685-3.102,1.685-4.902c0-2.137-0.832-4.146-2.344-5.656   C18.305,6.991,14.882,6.404,12,7.556V3c0-0.553-0.447-1-1-1H3C2.447,2,2,2.447,2,3v8c0,0.553,0.447,1,1,1h4.556   c-0.384,0.96-0.575,1.98-0.572,3H3c-0.553,0-1,0.447-1,1v8C2,24.553,2.447,25,3,25z M27.754,26.344C27.913,26.525,28,26.756,28,27   c0,0.267-0.104,0.518-0.293,0.707c-0.363,0.36-0.983,0.38-1.363,0.047l-2.987-4.181l0.217-0.217L27.754,26.344z M10,18.319   C9.721,17.904,9.514,17.459,9.35,17H10V18.319z M4,10V4h6v4.722c-0.234,0.186-0.461,0.384-0.678,0.6S8.908,9.766,8.722,10H4z    M9.799,12H11c0.553,0,1-0.447,1-1V9.799c0.922-0.529,1.945-0.817,2.979-0.817c1.537,0,3.073,0.585,4.243,1.755   c1.134,1.134,1.758,2.64,1.758,4.242c0,1.604-0.624,3.109-1.758,4.243s-2.64,1.758-4.243,1.758c-1.063,0-2.081-0.28-2.979-0.796V16   c0-0.553-0.447-1-1-1H8.984C8.981,13.96,9.266,12.928,9.799,12z M4,17h3.249c0.346,1.332,1.031,2.594,2.073,3.636   c0.215,0.215,0.443,0.413,0.678,0.601V23H4V17z"/>
                <path d="M9.207,5.355c-0.391-0.391-1.023-0.391-1.414,0L6.625,6.523L6.207,6.105c-0.391-0.391-1.023-0.391-1.414,0   s-0.391,1.023,0,1.414l1.125,1.125C6.113,8.84,6.369,8.938,6.625,8.938S7.137,8.84,7.332,8.645L9.207,6.77   C9.598,6.379,9.598,5.746,9.207,5.355z"/>
              </svg>
            </div>
            <div className='w-full max-w-80 relative pb-6'>
                <form onSubmit={handleSubmit}>
                    <div className='flex h-12 border border-border_color bg-field_color rounded-md overflow-hidden px-2'>
                        <label className='flex items-center w-full'>
                            <input
                                onChange={(e) => {setForm({ ...form, password: e.target.value }); setError("")}}
                                required
                                placeholder='hello world!'
                                className={`p-3 outline-none text-text_color focus:border-border_active text-sm h-full w-full bg-transparent disabled:cursor-not-allowed`}
                            />
                        </label>
                        <button type='submit' className="py-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="auto" height="full" viewBox="0 0 32 32" version="1.1">
                            <path d="M7.744 19.189l-1.656 5.797c-0.019 0.062-0.029 0.133-0.029 0.207 0 0.413 0.335 0.748 0.748 0.748 0.001 0 0.001 0 0.002 0h-0c0.001 0 0.002 0 0.003 0 0.075 0 0.146-0.011 0.214-0.033l-0.005 0.001 5.622-1.656c0.124-0.037 0.23-0.101 0.315-0.186l-0 0 17.569-17.394c0.137-0.135 0.223-0.323 0.223-0.531v-0c0-0 0-0.001 0-0.001 0-0.207-0.084-0.395-0.219-0.531l-4.141-4.142c-0.136-0.136-0.324-0.22-0.531-0.22s-0.395 0.084-0.531 0.22v0l-17.394 17.394c-0.088 0.088-0.153 0.198-0.189 0.321l-0.001 0.005zM25.859 3.061l3.078 3.078-3.078 3.047-3.079-3.047zM21.72 7.2l3.073 3.041-12.756 12.628-4.133 1.217 1.229-4.299zM30 13.25c-0.414 0-0.75 0.336-0.75 0.75v0 15.25h-26.5v-26.5h15.25c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0h-16c-0.414 0-0.75 0.336-0.75 0.75v0 28c0 0.414 0.336 0.75 0.75 0.75h28c0.414-0 0.75-0.336 0.75-0.75v0-16c-0-0.414-0.336-0.75-0.75-0.75v0z"/>
                          </svg>
                        </button>
                    </div>
                </form>
                {error && <p className='text-text_color text-sm absolute bottom-0 left-2'>{error}</p>}
            </div>
        </div>
      </div>
    )
}

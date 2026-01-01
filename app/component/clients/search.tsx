"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
export default function SearchAway(){
    const [search,setSeacrh] = React.useState("")
    const router = useRouter();
    const path =usePathname()
    const handleclick = (e:React.KeyboardEvent) => {
        if(e.code == "Enter"){
            window.location.href =`/?search=${search}`
        }
      }
    return (
        <input
        type="text"
        placeholder="Search books by title or author..."
        value={search}
        name='search'
        onChange={e => setSeacrh(e.target.value)}
        onKeyDown={e => handleclick(e)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
    )
}
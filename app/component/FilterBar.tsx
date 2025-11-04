"use client";
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import React from 'react';
interface FilterBarProps {
  categories: string[];

}

interface params {
  name: string;

}

export  function FilterBar({ categories }: FilterBarProps) {
    const params = useParams()
    const route = useRouter();
    const val = params?.name ? String(params?.name).replace("%20"," ") : "All"
    const [selectedCategory,setSelectedCatagory] = React.useState(val)
    console.log(selectedCategory)
    const handlecatagory = (cat:string) => {
      setSelectedCatagory(cat)
      route.replace(`/category/${cat}`)
      }
  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
              onClick={e => {setSelectedCatagory("All");route.push("/")}}

            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
              <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'

              }`}
              onClick={e => handlecatagory(category)}
            >
              {category}
        </button>
          ))}
        </div>
      </div>
    </div>
  );
}

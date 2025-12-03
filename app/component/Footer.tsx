import Link from "next/link";

export default function Footer(){
    return (
        <div className="w-100 border-t my-3 pt-5 mx-auto container">
            <div className="flex flex-col items-center gap-3">
                <p className="mb-0 text-sm text-gray-600">
                    All rights reserved by <span className="text-blue-500">@AbysiniaTech</span>
                </p>
                
                <p className="text-xs text-gray-500 text-center max-w-2xl px-4 mt-1">
                    Yemesahft Alem is your premier destination for discovering and downloading books across various genres. 
                    We offer a vast collection of literature including Ethiopian Fiction, History, Science, Religion, Philosophy, 
                    Psychology, and more. Our mission is to make knowledge and stories accessible to everyone, fostering a love 
                    for reading and learning in our community.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                    <Link 
                        href="/privacy-policy" 
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        Privacy Policy
                    </Link>
                    <Link 
                        href="/blog" 
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        Blog
                    </Link>
                    <Link 
                        href="/terms-of-service" 
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        Terms of Service
                    </Link>
                </div>
            </div>
        </div>
    )
}
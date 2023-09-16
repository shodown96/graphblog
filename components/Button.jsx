import React from 'react'
import { LoaderIcon } from '../assets/icons'

function Button({
    fill,
    loading = false,
    onClick,
    children,
    className = '', }) {
        
    return (
        <button type="button" onClick={onClick} className={`transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer`}>
            <div className="flex items-center gap-2">
                {loading ? <><LoaderIcon /> Loading</> : <>{children}</>}
            </div>
        </button>
    )
}

export default Button
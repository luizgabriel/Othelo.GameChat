import React from 'react'

const Button = ({ children }) => {
    return (
        <button className="focus:outline-none text-green-600 text-sm py-2.5 px-5 rounded-md border border-green-600 hover:bg-green-50">
            {children}
        </button>
    );
}

export default Button;
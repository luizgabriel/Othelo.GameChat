import React from 'react'

const Button = ({ children, color, className, onClick }) => {
    const styles = `focus:outline-none text-green-600 text-sm py-2.5 px-5 rounded-md border border-${color}-600 hover:bg-${color}-50 ${className}`;

    return (
        <button className={styles} onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;
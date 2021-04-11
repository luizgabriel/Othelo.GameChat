import React from 'react'

const Button = ({ children, color, className, onClick }) => {
    color = color || 'green';
    const styles = `focus:outline-none text-${color}-600 text-sm py-2.5 px-5 rounded-md transition-all border border-${color}-600 hover:bg-${color}-500 hover:text-white ${className}`;

    return (
        <button className={styles} onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;
import React from 'react'

const Layout = ({ children }) => {
    return (
        <div className="md:container md:mx-auto">
            {children}
        </div>
    )
}

export default Layout;
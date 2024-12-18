import { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({children}: MainLayoutProps) => {
    return (
        <>
            <p>Testes</p>
            <div>
                {children}
            </div> 
        </>
    )
}

export default MainLayout;
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { GoSun } from "react-icons/go";
import { BsMoonStars } from "react-icons/bs";

const ButtonDark = () => {

    const [isDark, setIsDark] = useState(false);

    const handleDarkMode = () => {
        setIsDark(!isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    return (
        <Button variant={'outline'} onClick={handleDarkMode}>
            {isDark ? <><BsMoonStars className="mr-1" />Modo Escuro</> : <><GoSun className="mr-1" />Modo Claro</>}
        </Button>
    );
}

export default ButtonDark;
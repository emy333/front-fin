import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GoSun } from "react-icons/go";
import { BsMoonStars } from "react-icons/bs";

interface ButtonDarkProps {
    setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}

const ButtonDark = ({ setIsDark }: ButtonDarkProps) => {
    const [isDark, setLocalIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setLocalIsDark(savedTheme === "dark");
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setLocalIsDark(prefersDark);
        }
    }, []);

    const handleDarkMode = () => {
        const newTheme = !isDark ? "dark" : "light";
        setLocalIsDark(!isDark);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", !isDark);
        setIsDark(!isDark);  
    };

    return (
        <Button variant={"outline"} onClick={handleDarkMode}>
            {isDark ? (
                <>
                    <GoSun className="mr-1" />
                    Modo Claro
                </>
            ) : (
                <>
                    <BsMoonStars className="mr-1" />
                    Modo Escuro
                </>
            )}
        </Button>
    );
};

export default ButtonDark;

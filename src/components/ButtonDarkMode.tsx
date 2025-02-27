import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

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
                    <Sun className="mr-1" />
                </>
            ) : (
                <>
                    <Moon className="mr-1" />
                </>
            )}
        </Button>
    );
};

export default ButtonDark;

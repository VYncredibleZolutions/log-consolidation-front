"use client";
import { LoginService } from "@/utils/login";
import { ArrowBack } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AppBar() {
    const [isLogged, setIsLogged] = useState<boolean>(false);
    const router = useRouter()

    const pathname = usePathname();

    const handleValidateLogin = (pathname: string) => {
        const login = new LoginService()
        if (pathname === '/') {
            login.logoutUser();
            setIsLogged(false);
        } else {
            const getIsLogged = login.checkIsLogged();
            if (getIsLogged) {
                setIsLogged(true);
            } else {
                router.push('/')
                setIsLogged(false);
            }
        }
    }

    const handleBackButton = () => {
        router.back()
    }

    useEffect(() => {
        handleValidateLogin(pathname);
    }, [pathname]);

    return (
        <>
            <div className="bg-black p-4 grid grid-cols-3 h-[75px]">
                {
                    isLogged &&
                    <div className="flex items-center">

                        <ArrowBack className="cursor-pointer" onClick={() => handleBackButton()} />

                    </div>
                }
                <div className="col-start-2 flex justify-center items-center">
                    <h1 className="archivo-black-regular text-2xl">
                        VYZ
                    </h1>
                </div>
                <div className="flex justify-end items-center">
                    {
                        isLogged &&
                        <button
                            className=" text-white font-bold p-3  rounded-full"
                            onClick={() => {
                                router.push('/')
                                setIsLogged(false);
                            }}
                        >
                            <LogoutIcon />
                        </button>
                    }
                </div>
            </div>
        </>
    )
}
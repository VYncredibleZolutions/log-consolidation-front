"use client";
import { LoginService } from "@/utils/login";
import { Card, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
    const router = useRouter()
    const [userLoggin, setUserLoggin] = useState<{ userName: string, password: string }>({ userName: '', password: '' });


    const handleCheckIsLogged = () => {
        const logginService = new LoginService;
        const response = logginService.checkLogin(userLoggin);
        if (response) {
            toast('Login successful',
                {
                    type: 'success',
                    theme: 'colored',
                    position: 'bottom-center'
                }
            );
            router.push('/home')
        } else {
            toast('Unable to login',
                {
                    type: 'error',
                    theme: 'colored',
                    position: 'bottom-center'
                }
            )
        }
    }

    return (
        <div className="h-[calc(100vh-75px)] flex flex-col">
            <div className="flex-1 flex items-center justify-center">
                <Card className="p-4 w-full mx-4 md:w-3/4 lg:w-4/6 xl:w-2/5 2xl:w-1/5">
                    <div className="border-b border-primary px-6 py-3 flex justify-center items-center font-semibold">
                        LOGIN
                    </div>
                    <div className="py-5 grid grid-cols-1 gap-3 ">
                        <TextField
                            label='User Name'
                            onChange={(event) => {
                                setUserLoggin({ ...userLoggin, userName: event.target.value })
                            }}
                        />
                        <TextField
                            type="password"
                            label='Password'
                            onKeyDown={(event) => {
                                if (event.code === 'Enter') {
                                    handleCheckIsLogged()
                                }
                            }}
                            onChange={(event) => {
                                setUserLoggin({ ...userLoggin, password: event.target.value })
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-1">
                        <button onClick={() => handleCheckIsLogged()} className="bg-primary p-2 rounded-md hover:bg-second text-black">
                            Login
                        </button>
                    </div>
                </Card>
            </div>

        </div>
    )
}
import Image from "next/image";
import Link from "next/link";
import image404 from '../../public/assets/monster-404-error-animate.svg';

export default function NotFound() {
    return (
        <div className="flex-1 h-[calc(100vh-75px)]  w-full flex justify-center items-center">
            <div className="w-1/2 h-1/2 flex justify-center items-center flex-col">
                <Image
                    src={image404}
                    alt="404 not found image"
                />
                Unable to find the page you are looking for
                <Link href='/home' className="text-yellow-becaps hover:text-yellow-becaps-second">
                    Click here to go home
                </Link>
            </div>
        </div>
    )
}
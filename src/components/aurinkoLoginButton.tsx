"use client";
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";
import { getAurinkoAuthUrl } from "~/lib/aurinko";

export const AurinkoLoginButton = () => {
    const router = useRouter();
    return (
        <Button onClick={async()=>{ 
            const url = await getAurinkoAuthUrl('Google');
            router.push(url);
            // console.log("url is ",url);
         }}>Link Gmail Account</Button>
    )
}

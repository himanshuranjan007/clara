"use client";

import { Button } from "./ui/button";

export const AurinkoLoginButton = () => {
    const handleClick = async () => {
        const response = await fetch('/api/aurinko/url');
        const data = await response.json();
        window.location.href = data.url;
    }
    return <Button onClick={handleClick}>Login with Aurinko</Button>;
}

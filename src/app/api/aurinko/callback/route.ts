import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForAccessToken, getAccountDetails, mailSync } from "~/lib/aurinko";
import { db } from "~/server/db";


export const GET = async (req: NextRequest) => {

    const { userId } = await auth();
    console.log("userid is ", userId || "no user id");
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const params = req.nextUrl.searchParams;
    const status = params.get("status");
    console.log("status is ", status);
    if (status !== "success") {
        return NextResponse.json({ message: "Failed to link user account" });
    }

    const code = params.get("code");
    console.log("code is ", code);
    if (!code) return NextResponse.json({ message: "No code provided" }, { status: 400 });
    const token = await exchangeCodeForAccessToken(code);

    if(!token) return NextResponse.json({ message: "Failed to exchange code for access token" },{ status: 400 });

 
    console.log("aurinkoToken is ", token);

    // return NextResponse.json({ message: "Success", aurinkoToken }); //for testing


    const accountDetails = await getAccountDetails(token.accessToken);
    if(!accountDetails) return NextResponse.json({ message: "Failed to get account details" }, { status: 400 });
    console.log("accountDetails is ", accountDetails);

    await db.account.upsert({
        where:{
            id:token.accountId.toString()
        },
        update:{
            accessToken:token.accessToken,
            
        },
        create:{
            id:token.accountId.toString(),
            userId,
            email:accountDetails.email,
            name:accountDetails.name,
            accessToken:token.accessToken,
        }
    })

    await mailSync(token.accessToken);
    
    return NextResponse.redirect(new URL("/mail", req.url));

}
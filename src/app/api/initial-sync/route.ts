// /api/initial-sync
import { NextRequest ,NextResponse} from "next/server"
import { db } from "~/server/db";
import { Account } from "~/lib/accounts";


export const POST = async( req :NextRequest){
    const {accountId, userId} = await req.json();
    if(!accountId || !userId){
        return NextResponse.json({ message: "Invalid request" }, { status: 400 })
    }

    const dbAccount = await db.account.findUnique({
        where:{
            id:accountId,
            userId:userId
        }
    })

    if(!dbAccount){
        return NextResponse.json({ message: "Account not found" }, { status: 404 })
    }

    // perform initial sync 
    const account = new Account(dbAccount.accessToken);
    



    return NextResponse.json({ message: "Success" });
}
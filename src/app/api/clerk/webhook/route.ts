//api/clerk/webhook/

import { db } from "~/server/db";

//https://clerk.com/docs/references/webhooks/user-created




export const POST = async (req:Request) => {
    const {data} = await req.json();
    // const {id, email_addresses, image_url, first_name, last_name} = data;
    const firstName = data.first_name;
    const lastName = data.last_name;
    const emailAddress = data.email_addresses[0].email_address; // 
    const imageUrl = data.image_url;
    const id = data.id;

    
    console.log("Webhook received", data);

    await db.user.create({
        data: {
            id,
            emailAddress: emailAddress,
            firstName,
            lastName,
            imageUrl,
        }
    })
    return new Response("Webhook received", {status: 200});
}

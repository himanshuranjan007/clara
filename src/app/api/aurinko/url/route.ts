import { NextRequest, NextResponse } from "next/server";
import { getAurinkoAuthUrl } from "~/lib/aurinko";

export async function GET(request: NextRequest) {
    const url = await getAurinkoAuthUrl('Google');
    return NextResponse.json({ url });
}
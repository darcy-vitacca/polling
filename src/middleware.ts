import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log("Req", req);
  console.log("Req", req.cookies);
  console.log('req.cookies.get("poll-token")', req.cookies.get("poll-token"));
  if (req.cookies.get("poll-token")) return;



  const random = nanoid();

  const res = NextResponse.next();
  res.cookies.set("poll-token", random, { sameSite: "strict" });

  return res;
}

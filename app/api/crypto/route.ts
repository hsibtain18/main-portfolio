import { TempData } from "@/app/constant/experienceData";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(TempData);
}
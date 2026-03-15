// src/app/api/diag/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Check current database and search path
    const dbInfo = await prisma.$queryRaw`SELECT current_database(), current_schema(), current_user`;
    
    // 2. List all tables in the current schema
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    // 3. Specifically check for 'accounts' table
    const accountsTable = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'accounts'
      )
    `;

    return NextResponse.json({
      dbInfo,
      tables,
      accountsTable,
      status: "success"
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
      status: "error"
    }, { status: 500 });
  }
}

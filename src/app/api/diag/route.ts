// src/app/api/diag/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Check current database and search path
    const dbInfo = await prisma.$queryRaw`SELECT current_database(), current_schema(), current_user`;
    
    // 2. Check Tutor table structure (raw query to see columns)
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'tutors'
    `;

    // 3. Try a raw select to see if it even works
    const rawTutors = await prisma.$queryRaw`SELECT * FROM tutors LIMIT 1`;

    // 4. Specifically check for the error-causing Prisma query
    let prismaError = null;
    try {
      await prisma.tutor.findMany({ take: 1 });
    } catch (e: unknown) {
      if (e instanceof Error) {
        prismaError = {
          message: e.message,
          code: (e as any).code,
          meta: (e as any).meta
        };
      } else {
        prismaError = { message: "Unknown Prisma error" };
      }
    }

    return NextResponse.json({
      dbInfo,
      columns,
      rawTutors,
      prismaError,
      status: "success"
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json({
      error: errorMessage,
      stack: errorStack,
      status: "error"
    }, { status: 500 });
  }
}

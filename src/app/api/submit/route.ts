import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "db.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, subject } = body;

    if (!name || !subject) {
      return new NextResponse("Name and subject are required", { status: 400 });
    }

    let data = [];
    if (fs.existsSync(dbPath)) {
      const fileContent = fs.readFileSync(dbPath, "utf-8");
      if (fileContent) {
        data = JSON.parse(fileContent);
      }
    }

    data.push({ name, subject });

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    return new NextResponse("Form submitted successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// app/api/receipts/[filename]/route.js
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req, { params }) {
    try {
        const { filename } = params;
        const filePath = path.join(process.cwd(), "receipts", filename);

        // Check if file exists
        await fs.access(filePath);

        // Read the file
        const fileBuffer = await fs.readFile(filePath);

        // Set headers for PDF response
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error("Error serving PDF:", error.message);
        return NextResponse.json({ success: false, message: "PDF not found" }, { status: 404 });
    }
}
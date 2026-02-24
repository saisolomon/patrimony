import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireSubscription, getUserDocuments } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const VALID_CATEGORIES = ["trust", "operating-agreement", "tax-return", "insurance", "general"];

export async function POST(req: NextRequest) {
  try {
    const user = await requireSubscription();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string | null;
    const category = formData.get("category") as string | null;
    const entityId = formData.get("entityId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Accepted: PDF, DOCX, XLSX, PNG, JPG" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit" },
        { status: 400 }
      );
    }

    const docCategory = category && VALID_CATEGORIES.includes(category) ? category : "general";

    // Upload to Vercel Blob
    const blob = await put(`documents/${user.id}/${file.name}`, file, {
      access: "public",
    });

    // Store metadata in DB
    const document = await prisma.document.create({
      data: {
        userId: user.id,
        entityId: entityId || undefined,
        name: name || file.name.replace(/\.[^.]+$/, ""),
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        blobUrl: blob.url,
        category: docCategory,
      },
    });

    return NextResponse.json({
      id: document.id,
      name: document.name,
      fileName: document.fileName,
      blobUrl: document.blobUrl,
      category: document.category,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await requireSubscription();
    const documents = await getUserDocuments(user.id);

    const serialized = documents.map((d) => ({
      id: d.id,
      name: d.name,
      fileName: d.fileName,
      fileSize: d.fileSize,
      mimeType: d.mimeType,
      blobUrl: d.blobUrl,
      category: d.category,
      entityName: d.entity?.name || null,
      createdAt: d.createdAt.toISOString(),
    }));

    return NextResponse.json(serialized);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

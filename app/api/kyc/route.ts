import { db } from "@/db/drizzle";
import { KYCVerification } from "@/db/schema";
import cloudinary from "@/lib/cloudinary";
import { requireAuth } from "@/lib/rbac";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

interface CloudinaryUploadResult {
  secure_url: string;
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const formData = await req.formData();

    const phone = formData.get("phone") as string;
    const socialLink = formData.get("socialLink") as string;
    const experience = formData.get("experience") as string;
    const skills = JSON.parse(formData.get("skills") as string);
    const upiId = formData.get("upiId") as string;
    const documentFile = formData.get("document") as File;
    const selfieFile = formData.get("selfie") as File;

    if (
      !phone ||
      !experience ||
      !skills ||
      !documentFile ||
      !selfieFile ||
      !upiId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload helper
    const uploadToCloudinary = async (file: File, folder: string) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const upload: CloudinaryUploadResult = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder }, (err, result) => {
              if (err || !result) return reject(err);
              resolve({ secure_url: result.secure_url });
            })
            .end(buffer);
        }
      );

      return upload;
    };

    const documentUpload = await uploadToCloudinary(
      documentFile,
      `skillConnect/kyc/${user.id}`
    );
    const selfieUpload = await uploadToCloudinary(
      selfieFile,
      `skillConnect/kyc/${user.id}`
    );

    await db.insert(KYCVerification).values({
      userId: user.id,
      phone,
      socialLink,
      experience,
      skills,
      document: documentUpload.secure_url,
      selfie: selfieUpload.secure_url,
      upiId,
    });
    revalidateTag("admin-dashboard", {});
    return NextResponse.json(
      { message: "KYC submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

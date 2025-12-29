import CustomLayout from "@/components/CustomLayout";
import InstructorRegisterForm from "@/components/form/instructorRegisterForm";
import Image from "next/image";
import { kyc } from "@/assets/images";
import { requireAuth } from "@/lib/rbac";
import { getUserKycStatus } from "@/actions/kycStatus";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const InstructorRegister = async () => {
  const user = await requireAuth();

  const kycStatus = await getUserKycStatus(user.id);
  if (kycStatus?.status === "approved") {
    redirect("/workshops/conductWorkshop");
  }


  return (
    <section className="pt-12">
      <CustomLayout>
        {kycStatus?.status === "rejected" && (
          <div className="text-red-600 font-semibold space-y-2 flex flex-col items-center pt-5 mb-10">
            <p>Your KYC has been rejected.</p>
            {kycStatus.rejectionReason && (
              <p>Reason: {kycStatus.rejectionReason}</p>
            )}
            <p>You can resubmit your KYC below.</p>
            <Separator className="bg-secondary" />
          </div>
        )}
        {kycStatus?.status === "pending" && (
          <div className="w-full h-[50vh] flex items-center justify-center">
            <p className="text-yellow-600 font-semibold ">
              Your KYC is pending. Please wait for admin approval.
            </p>
          </div>
        )}

        {(kycStatus?.status === "rejected" || kycStatus === null) && (
          <>
            <h1 className="my-5 text-xl font-bold text-center">
              Instructor KYC Verification
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-4">
              <Image
                src={kyc}
                width={500}
                height={500}
                alt="KYC Image"
                className="md:block hidden"
              />
              <div className="col-span-3">
                <InstructorRegisterForm />
              </div>
            </div>
          </>
        )}
      </CustomLayout>
    </section>
  );
};

export default InstructorRegister;

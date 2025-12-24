import CustomLayout from "@/components/CustomLayout";
import InstructorRegisterForm from "@/components/form/instructorRegisterForm";
import Image from "next/image";
import { kyc } from "@/assets/images";

const InstructorRegister = () => {
  return (
    <section className="pt-12">
      <CustomLayout>
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
      </CustomLayout>
    </section>
  );
};

export default InstructorRegister;

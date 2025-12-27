import KYCTable from "@/components/KYCTable";

const KYCVerification = () => {
  return (
    <div className="">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold  mb-2">KYC Verification</h1>
        <p className=" text-sm md:text-base">
          Review and manage users’ KYC submissions. Approve, reject, or view
          details.
        </p>
      </div>
      <KYCTable />
    </div>
  );
};

export default KYCVerification;

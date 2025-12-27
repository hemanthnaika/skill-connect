import { getUserKycStatus } from "@/actions/kycStatus";
import WorkShopForm from "@/components/WorkShopForm";
import { requireAuth } from "@/lib/rbac";

import { redirect } from "next/navigation";

export default async function CreateWorkshopPage() {
  const user = await requireAuth();

  const kycStatus = await getUserKycStatus(user.id);

  // 🚫 Block access if not approved
  if (kycStatus?.status !== "approved") {
    redirect("/workshops/kyc?reason=required");
  }

  // ✅ Allowed
  return <WorkShopForm />;
}

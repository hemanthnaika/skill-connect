import CustomLayout from "@/components/CustomLayout";
import WorkShopForm from "@/components/form/WorkShopForm";

const ConductWorkshop = () => {
  return (
    <section>
      <CustomLayout>
        <div className="mt-5 text-center">
          <h1 className="text-center font-bold  text-2xl tracking-wider">
            Create New Workshop
          </h1>
          <p className="text-sm/loose ">
            {" "}
            Fill all details to publish your workshop on SkillConnect
          </p>
        </div>
        <WorkShopForm />
      </CustomLayout>
    </section>
  );
};

export default ConductWorkshop;

"use client";
import { Button } from "./ui/button";

type RegisterProp = {
  userId: string;
  slug: string;
  price: number;
  workshopId: string;
};
const RegisterButton = ({ userId, slug, price, workshopId }: RegisterProp) => {
  const handleRegister = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ userId, slug, price, workshopId }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.url) {
        // redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };
  return (
    <Button
      variant="default"
      className="mt-5 text-white"
      onClick={handleRegister}
    >
      Register Now
    </Button>
  );
};

export default RegisterButton;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
  return (
    <div className="max-w-lg mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>

      <form className="space-y-5">
        <div>
          <label className="text-sm font-medium">Your Name</label>
          <Input type="text" placeholder="Enter your name" className="mt-1" />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <Input type="email" placeholder="Enter your email" className="mt-1" />
        </div>

        <div>
          <label className="text-sm font-medium">Message</label>
          <Textarea
            placeholder="Write your message..."
            className="mt-1 min-h-[120px]"
          />
        </div>

        <Button type="submit" className="w-full text-white">
          Send Message
        </Button>
      </form>
    </div>
  );
}

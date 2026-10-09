import { whatsappLink } from "@/lib/whatsapp";
import { ButtonLink } from "./Button";
import { WhatsAppIcon } from "./WhatsAppButton";

export function FinalCta() {
  return (
    <section className="section bg-ink text-center text-porcelain" aria-labelledby="cta-title">
      <div className="container-site">
        <h2 id="cta-title" className="text-3xl md:text-4xl">
          Your stay starts here.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg text-sage">
          Book online in a couple of minutes, or message us and we&rsquo;ll help you plan your stay.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/book">Check availability</ButtonLink>
          <ButtonLink href={whatsappLink("Hi, I'd like to book a stay at Unicorn Haven Edge Hotel.")} variant="light">
            <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

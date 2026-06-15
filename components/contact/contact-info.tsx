import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactInfo() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        Contact
      </p>

      <h1 className="mt-2 max-w-[500px] text-3xl leading-tight font-semibold text-slate-900 sm:text-[48px] sm:leading-[1.05] sm:tracking-[-0.03em]">
        Let&apos;s build your solar project together.
      </h1>

      <p className="mt-4 max-w-md text-sm leading-6 text-slate-500 sm:text-base sm:leading-normal">
        Tell us what you&apos;re planning. Our engineering team will respond with a
        tailored proposal within one business day.
      </p>

      <ul className="mt-10 space-y-5 text-sm">
        <li className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100">
            <Phone className="h-4 w-4 text-blue-700" />
          </span>

          <div>
            <p className="font-semibold text-slate-900">
              Call
            </p>

            <p className="text-slate-500">
              <a
                href="tel:+917479766602"
                className="hover:text-blue-600"
              >
                +91 7479766602
              </a>
            </p>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100">
            <Mail className="h-4 w-4 text-blue-700" />
          </span>

          <div>
            <p className="font-semibold text-slate-900">
              Email
            </p>

            <p className="text-slate-500">
              <a
                href="mailto:backenviro@gmail.com"
                className="hover:text-blue-600"
              >
                backenviro@gmail.com
              </a>
            </p>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100">
            <MapPin className="h-4 w-4 text-blue-700" />
          </span>

          <div>
            <p className="font-semibold text-slate-900">
              Visit
            </p>

            <p className="text-slate-500">
              ENVIRO TECH TECHNOLOGIES<br />
              NS-11(P-1)<br />
              Industrial Estate, Bela<br />
              Phase-1, Near P&amp;M Mall<br />
              Muzaffarpur, Bihar - 842005
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const data: ContactItemData[] = [
  {
    title: "Ghé thăm",
    subtitle: "TP. Hồ Chí Minh, Việt Nam",
    icon: (
      <MapPin className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-signal" />
    ),
  },
  {
    title: "Gọi cho chúng tôi",
    subtitle: "+84 914 618 305",
    icon: (
      <Phone className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-signal" />
    ),
  },
  {
    title: "Email",
    subtitle: "keynity.shop@gmail.com",
    icon: (
      <Mail className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-signal" />
    ),
  },
  {
    title: "Giờ làm việc",
    subtitle: "T2 - CN: 7:00 - 17:00",
    icon: (
      <Clock className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-signal" />
    ),
  },
];

const FooterTop = () => {
  return (
    <div className="grid grid-cols-1 gap-4 border-b border-white/10 py-8 sm:grid-cols-2 xl:grid-cols-4">
      {data?.map((item, index) => (
        <div
          key={index}
          className="group flex items-start gap-3 rounded-xl border border-white/10 bg-ink-soft p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-signal/40 hover:shadow-sm"
        >
          <span className="mt-0.5 rounded-full bg-white/5 p-2">
            {item?.icon}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-white transition-colors group-hover:text-signal">
              {item?.title}
            </h3>
            <p className="mt-1 text-sm text-zinc-400 transition-colors group-hover:text-zinc-300">
              {item?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;

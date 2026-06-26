import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const data: ContactItemData[] = [
  {
    title: "Visit Us",
    subtitle: "HCM City, Vietnam",
    icon: (
      <MapPin className="h-5 w-5 text-gray-600 transition-colors group-hover:text-primary" />
    ),
  },
  {
    title: "Call Us",
    subtitle: "+84 914 618 305",
    icon: (
      <Phone className="h-5 w-5 text-gray-600 transition-colors group-hover:text-primary" />
    ),
  },
  {
    title: "Working Hours",
    subtitle: "Mon - Sun: 7:00 AM - 5:00 PM",
    icon: (
      <Clock className="h-5 w-5 text-gray-600 transition-colors group-hover:text-primary" />
    ),
  },
  {
    title: "Email Us",
    subtitle: "keynity.shop@gmail.com",
    icon: (
      <Mail className="h-5 w-5 text-gray-600 transition-colors group-hover:text-primary" />
    ),
  },
];

const FooterTop = () => {
  return (
    <div className="grid grid-cols-1 gap-4 border-b py-8 sm:grid-cols-2 xl:grid-cols-4">
      {data?.map((item, index) => (
        <div
          key={index}
          className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm"
        >
          <span className="mt-0.5 rounded-full bg-gray-100 p-2">
            {item?.icon}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-black">
              {item?.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600 transition-colors group-hover:text-gray-800">
              {item?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;

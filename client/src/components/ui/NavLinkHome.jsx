import { NavLink } from "react-router-dom";

export default function NavLinkHome({ navlinkHeader, navlinkList }) {
  return (
    <div className="flex items-end gap-6 mb-4 md:px-8 px-6">
      <NavLink
        to={`/${navlinkHeader.link}`}
        className={`text-2xl sm:text-[28px] font-bold text-gray-900  relative inline-block`}
      >
        {navlinkHeader.name}
      </NavLink>
      <div className="flex gap-4">
        {navlinkList?.map((item, idx) => (
          <NavLink
            to={`/${item.link}`}
            key={idx}
            className="hover:underline underline-offset-8 text-[16px] sm:text-[20px] font-semibold"
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

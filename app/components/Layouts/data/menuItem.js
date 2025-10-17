import CategoriesIcon from "../../svgs/CategoriesIcon";
import DashboardIcon from "../../svgs/DashboardIcon";
import EmptyProductIcon from "../../svgs/EmptyProductIcon";
import PlusIcon from "../../svgs/PlusIcon";

export const menuItems = [
  {
    name: "Dashboard",
    icon: <DashboardIcon className="w-5 h-5" />,
    href: "/dashboard",
  },
  {
    name: "Products",
    icon: <EmptyProductIcon className="w-5 h-5" />,
    href: "/products",
  },
  {
    name: "Add Product",
    icon: <PlusIcon className="w-5 h-5" />,
    href: "/products/create",
  },
  {
    name: "Categories",
    icon: <CategoriesIcon className="w-5 h-5" />,
    href: "/categories",
  },
];

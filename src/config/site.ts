
export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
};

export const siteConfig = {
  name: "Venue Vendors",
  description: "Find and book top vendors for your events!",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Suggest a Category",
      href: "/suggest-category",
    }
  ] satisfies NavItem[],
  userNav: {
    client: [
      { title: "My Favs", href: "/my-favs" },
      { title: "My Profile", href: "/profile" },
    ],
    vendor: [
      { title: "Dashboard", href: "/dashboard/vendor" },
      { title: "My Profile", href: "/profile" },
    ],
  }
};



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
  description: "Find and book the best vendors for your events. From taco trucks to wedding planners, we've got you covered!",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Browse Vendors",
      href: "/search",
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

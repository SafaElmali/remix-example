import { Home, ListTodo, PersonStanding, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@remix-run/react";
import UrlUtil from "@/lib/urls";

// Menu items.
const items = [
  {
    title: "Home",
    url: UrlUtil.buildRootUrl(),
    icon: Home,
  },
  {
    title: "Rick and Morty",
    url: UrlUtil.buildRickAndMortyUrl(),
    icon: Users,
  },
  {
    title: "About",
    url: UrlUtil.buildAboutUrl(),
    icon: PersonStanding,
  },
  {
    title: "Tasks",
    url: UrlUtil.buildTasksUrl(),
    icon: ListTodo,
  },
  {
    title: "Users",
    url: UrlUtil.buildUsersUrl(),
    icon: Users,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export { AppSidebar };

import { ReactNode } from "react";

export interface DrawerItem {
  title: string;
  icon: ReactNode;
  color?: string;
  onClick: () => void;
  address: string;
}

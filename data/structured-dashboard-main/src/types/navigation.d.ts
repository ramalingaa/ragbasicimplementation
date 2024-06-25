import { ReactComponentElement } from "react";

export interface IRoute {
  id: any;
  name: string;
  description: string;
  layout: string; 
  icon: ReactComponentElement | string;
  secondary?: boolean;
  path: string;
  shortcut: 'H' | 'Q' | 'R' | 'B';
}

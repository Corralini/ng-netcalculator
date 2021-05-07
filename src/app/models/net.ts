export interface Net {
  ip: string;
  mask: number;
  childs: Net[];
  used: boolean;
}

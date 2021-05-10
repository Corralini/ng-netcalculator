export interface Net {
  ip: string;
  mask: number;
  childs: Net[];
  used: boolean;
  broadcast?: string;
  ipRouter?: string;
  firstIp?: string;
  lastIp?: string;
}

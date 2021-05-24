import {Net} from './net.model';

export const INTERFAZ_BASE_NAME = 'GigabitEthernet';

export interface Interface {
  nombre: string;
  red: Net;
  disableLinkRouter?: boolean;
  show?: boolean;
}

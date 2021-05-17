import {Interface} from './interfaz.model';
import {Connection} from './connection.model';


export interface Router {
  nombre: string;
  interfaces: Interface[];
  connection: Connection[];
}

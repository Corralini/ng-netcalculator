import {Net} from './net.model';
import {Router} from './router.model';

export interface Connection {
  net?: Net;
  router?: Router;
}

import {Component, Input, OnInit} from '@angular/core';
import {Net} from '../../../models/net.model';
import {GuessNet} from '../../../models/guess-net.model';
import {Router} from '../../../models/router.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SelectNetModalComponent} from './select-net-modal/select-net-modal.component';
import {Interface, INTERFAZ_BASE_NAME} from '../../../models/interfaz.model';
import {calculateNextIp} from '../../../utils/ip-uils';
import {RoutingTable} from '../../../models/routing-table.model';
import {PacketTracerModalComponent} from './packet-tracer-modal/packet-tracer-modal.component';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.css']
})
export class SchemaComponent implements OnInit {

  @Input() nets: Net;
  @Input() guessNet: GuessNet[];
  letras = [...'abcdefghijklmnopkrstuwxyz'];
  idxLetters = 0;
  routers: Router[] = [];
  selectedNet: Net;
  workGuessNet: GuessNet[];
  workNets: Net;
  usedNets: Net[] = [];

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.createFirstRouter();
  }

  getLetter(): string {
    const letter = this.letras[this.idxLetters];
    this.idxLetters++;
    return letter;
  }

  createFirstRouter(): void {
    this.workGuessNet = [...this.guessNet];
    this.workNets = this.nets;
    this.generateRouter();
  }

  generateRouter(): Router {
    const router: Router = {
      nombre: 'Router ' + this.getLetter().toUpperCase(),
      interfaces: [],
      connection: []
    };
    this.routers.push(router);
    return router;
  }

  addRouter(router: Router, interfaz?: Interface): void {
    const newRouter = this.generateRouter();
    this.selectedNet.firstIp = calculateNextIp(this.selectedNet.firstIp);
    let newNet: Net;

    if (interfaz) {
      interfaz.red.firstIp = calculateNextIp(interfaz.red.firstIp);
      newNet = {...interfaz.red};
      newNet.ipRouter = calculateNextIp(newNet.ipRouter);
      this.routers.filter(value => value.nombre !== router.nombre).forEach(rout => {
        const interfaces = rout.interfaces.filter(int => int.red.ip === interfaz.red.ip);
        if (interfaces && interfaces.length > 0) {
          this.addConection(rout, newRouter);
          this.addConection(newRouter, rout);
        }
      });
    } else {
      router.interfaces.push({
        red: this.selectedNet,
        nombre: INTERFAZ_BASE_NAME + router.interfaces.length + '/0'
      });
      newNet = {...this.selectedNet};
    }

    newNet.ipRouter = calculateNextIp(newNet.ipRouter);
    newRouter.interfaces.push({
      red: newNet,
      nombre: INTERFAZ_BASE_NAME + newRouter.interfaces.length + '/0'
    });

    this.addConection(router, newRouter);
    this.addConection(newRouter, router);
  }

  addNet(router: Router): void {
    router.interfaces.push({
      red: this.selectedNet,
      nombre: INTERFAZ_BASE_NAME + router.interfaces.length + '/0',
      disableLinkRouter: true
    });
    this.addConection(router, undefined, this.selectedNet);
  }

  addConection(router: Router, connectionRouter?: Router, connectionNet?: Net): void {
    if (connectionRouter) {
      router.connection.push({
        router: connectionRouter
      });
    }
    if (connectionNet) {
      router.connection.push({
        net: connectionNet
      });
    }
  }

  selectNet(router: Router, isRouter = false): void {
    const modalRef = this.modalService.open(SelectNetModalComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      scrollable: true
    });
    modalRef.componentInstance.guessNets = this.workGuessNet;
    modalRef.componentInstance.allNet = this.workNets;
    modalRef.result.then(resuult => {
      if (resuult) {
        this.selectedNet = resuult;
        this.usedNets.push(this.selectedNet);
        if (isRouter) {
          this.addRouter(router);
        } else {
          this.addNet(router);
        }
      }
    });
  }

  openPacketTracerCommand(config: string): void {
    const modalRef = this.modalService.open(PacketTracerModalComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      scrollable: true
    });
    modalRef.componentInstance.config = config;
  }

  generatePacketTracerCommands(router: Router): void {
    let config = `en \n`;
    router.interfaces.forEach(value => {
      config += `conf t \n`;
      config += `int ${value.nombre} \n`;
      config += `ip address ${value.red.ipRouter} ${value.red.decimalMask} \n`;
      config += `no shutdown \n`;
      config += `exit \n`;
    });

    const routingTables = this.createRoutingTable(router);
    routingTables.forEach(value => {
      config += `ip route ${value.ipDestino} ${value.mask} ${value.puertaEnlace} \n`;
    });
    config += `exit \n`;
    this.openPacketTracerCommand(config);
  }

  createRoutingTable(router: Router): RoutingTable[] {
    let usedNets = [...this.usedNets];
    const routingTable: RoutingTable[] = [];
    router.interfaces.forEach(interfaz => {
      usedNets = usedNets.filter(value => value.ip !== interfaz.red.ip);
    });

    if (usedNets && usedNets.length > 0) {
      usedNets.forEach(netUsed => {
        let routersWithNet = this.routers.filter(rout => rout !== router);
        routersWithNet = routersWithNet.filter(routerSearch =>
          routerSearch.interfaces.filter(routIn => routIn.red.ip === netUsed.ip).length > 0);
        routersWithNet.forEach(rout => {
          if (!routingTable.find(rt => rt && rt.ipDestino === netUsed.ip)) {
            routingTable.push(this.createRoutTable(rout, router, netUsed));
          }
        });

      });
    }
    return routingTable;

  }

  createRoutTable(routerConfig: Router, connectionRouter: Router, redDestino: Net): RoutingTable {
    let routingTable: RoutingTable;
    if (routerConfig.connection.find(value => value.router && value.router.nombre === connectionRouter.nombre)) {
      const interfaces: Interface[] = [];
      routerConfig.interfaces.forEach(int => {
        if (connectionRouter.interfaces.find(value => value.red.ip === int.red.ip)) {
          interfaces.push(int);
        }
      });
      routingTable = {
        mask: redDestino.decimalMask,
        puertaEnlace: interfaces[0].red.ipRouter,
        ipDestino: redDestino.ip
      };
    } else {
      routerConfig.connection.forEach(con => {
        if (con.router) {
          routingTable = this.createRoutTable(con.router, connectionRouter, redDestino);
        }
      });
    }
    return routingTable;
  }

}

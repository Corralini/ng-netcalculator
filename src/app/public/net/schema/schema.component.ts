import {Component, Input, OnInit} from '@angular/core';
import {Net} from '../../../models/net.model';
import {GuessNet} from '../../../models/guess-net.model';
import {Router} from '../../../models/router.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from '../modal/modal.component';
import {SelectNetModalComponent} from './select-net-modal/select-net-modal.component';
import {Interface, INTERFAZ_BASE_NAME} from '../../../models/interfaz.model';
import {calculateNextIp} from '../../../utils/ip-uils';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.css']
})
export class SchemaComponent implements OnInit{

  @Input() nets: Net;
  @Input() guessNet: GuessNet[];
  letras = [...'abcdefghijklmnopkrstuwxyz'];
  idxLetters = 0;
  idxNet = 1;
  routers: Router[] = [];
  selectedNet: Net;
  workGuessNet: GuessNet[];
  workNets: Net;

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
      interfaces: []
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

  }

  addNet(router: Router): void {
    router.interfaces.push({
      red: this.selectedNet,
      nombre: INTERFAZ_BASE_NAME + router.interfaces.length + '/0',
      disableLinkRouter: true
    });
  }

  selectNet(router: Router, isRouter = false): void {
    const modalRef = this.modalService.open(SelectNetModalComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.guessNets = this.workGuessNet;
    modalRef.componentInstance.allNet = this.workNets;
    modalRef.result.then(resuult => {
      if (resuult) {
        this.selectedNet = resuult;

        if (isRouter) {
          this.addRouter(router);
        } else {
          this.addNet(router);
        }
      }
    });
  }
}

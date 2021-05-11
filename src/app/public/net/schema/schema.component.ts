import {Component, Input, OnInit} from '@angular/core';
import {Net} from '../../../models/net.model';
import {GuessNet} from '../../../models/guess-net.model';
import {Router} from '../../../models/router.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from '../modal/modal.component';
import {SelectNetModalComponent} from './select-net-modal/select-net-modal.component';

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
    this.routers.push({
      nombre: 'Router ' + this.getLetter(),
      interfaces: []
    });

  }


  addRouter(router: Router): void {
    console.log('Add router', this.selectedNet);
  }

  addNet(router: Router): void {
    console.log('Add net', this.selectedNet);
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

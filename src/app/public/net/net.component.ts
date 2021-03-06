import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from './modal/modal.component';
import {GuessNet} from '../../models/guess-net.model';
import {Net} from 'src/app/models/net.model';
import {generateSubIp, typeA, typeB, typeC} from '../../utils/ip-uils';

@Component({
  selector: 'app-net',
  templateUrl: './net.component.html',
  styleUrls: ['./net.component.css']
})
export class NetComponent implements OnInit {

  guessNets: GuessNet[] = [];
  numHostsTotales: number;
  ipDecimal: string;
  maskDecimal: number;
  ipType: string;
  net: Net;
  show = false;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.getNets();
  }

  getNets(edit = false, onlyView: boolean = false): void {
    this.show = false;
    const modalRef = this.modalService.open(ModalComponent, {backdrop: 'static', keyboard: false, centered: true, scrollable: true});
    modalRef.componentInstance.guessNets = [...this.guessNets];
    modalRef.componentInstance.edit = edit;
    modalRef.componentInstance.onlyView = onlyView;
    modalRef.result.then(resuult => {
      if (resuult) {
        this.guessNets = [];
        this.guessNets = resuult;
        this.calculateIp();
      }
      this.show = true;
    });
  }

  calculateIp(): void {
    this.numHostsTotales = this.calculateHostTotal();
    let countByteHosts = 0;
    let pow = Math.pow(2, countByteHosts) - 2;
    while (pow < this.numHostsTotales) {
      countByteHosts++;
      pow = Math.pow(2, countByteHosts) - 2;
    }
    if (countByteHosts <= 8) {
      this.ipDecimal = '192.168.100.0';
      this.ipType = typeC;
    } else if (countByteHosts > 8 && countByteHosts <= 16) {
      this.ipDecimal = '140.140.0.0';
      this.ipType = typeB;
    } else if (countByteHosts > 16 && countByteHosts <= 24) {
      this.ipDecimal = '10.0.0.0';
      this.ipType = typeA;
    }
    this.maskDecimal = 32 - countByteHosts;

    console.log('ip:', this.ipDecimal, 'mask:', this.maskDecimal);
    this.net = generateSubIp(this.ipDecimal, this.maskDecimal);
    console.log(this.net);

  }

  calculateHostTotal(): number {
    let hosts = 0;
    this.guessNets.forEach(value => {
      let cont = 0;
      let pow = Math.pow(2, cont) - 2;
      if (value.adjust) {
        while (pow < value.hosts) {
          cont++;
          pow = Math.pow(2, cont);
        }
      } else {
        while (pow < value.hosts) {
          cont++;
          pow = Math.pow(2, cont) - 2;
        }
      }
      hosts += pow * value.total;
    });
    return hosts;
  }
}

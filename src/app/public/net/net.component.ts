import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from './modal/modal.component';
import {GuessNet} from '../../models/guess-net';

@Component({
  selector: 'app-net',
  templateUrl: './net.component.html',
  styleUrls: ['./net.component.css']
})
export class NetComponent implements OnInit {

  guessNets: GuessNet[] = [];

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.getNets();
  }

  getNets(): void {
    const modalRef = this.modalService.open(ModalComponent, {backdrop: 'static', keyboard: false});
    modalRef.componentInstance.guessNets = [...this.guessNets];
    modalRef.result.then(resuult => {
      if (resuult) {
        this.guessNets = resuult;
      }
    });
  }

}

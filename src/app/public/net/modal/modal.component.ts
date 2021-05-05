import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GuessNet} from '../../../models/guess-net';
import {FormBuilder, Validators} from '@angular/forms';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  faPlus = faPlus;

  @Input() guessNets: GuessNet[];
  submitted = false;

  netForm = this.formBuilder.group({
    numHosts: ['', Validators.required],
    numRed: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder,
              private activeModal: NgbActiveModal) {
  }

  submit(): void {
    this.submitted = true;
    if (this.netForm.valid) {
      this.addNet({
        hosts: this.netForm.get('numHosts').value,
        total: this.netForm.get('numRed').value
      });
    }
  }

  addNet(net: GuessNet): void {
    if (net) {
      const serchNet = this.guessNets.find(value => value.hosts === net.hosts);
      if (serchNet) {
        serchNet.total += net.total;
      } else {
        this.guessNets.push(net);
        this.guessNets.sort((a, b) => (a.hosts < b.hosts) ? 1 : -1);
      }
    }
  }

  closeModal(send?: boolean): void {
    if (send) {
      console.log("tou aiqui");
      this.activeModal.close(this.guessNets);
    } else {
      console.log("porco");
      this.activeModal.close();
    }
  }

}

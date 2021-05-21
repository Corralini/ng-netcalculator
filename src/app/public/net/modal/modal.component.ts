import {Component, Input} from '@angular/core';
import {GuessNet} from '../../../models/guess-net.model';
import {FormBuilder, Validators} from '@angular/forms';
import {faCheck, faPlus, faTimes, faTrash} from '@fortawesome/free-solid-svg-icons';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SnotifyPosition, SnotifyService, SnotifyStyle} from 'ng-snotify';
import {SnotifyToastConfig} from 'ng-snotify/lib/interfaces/snotify-toast-config.interface';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  faPlus = faPlus;
  faTrash = faTrash;
  faCheck = faCheck;
  faCross = faTimes;

  snotifyConfig: SnotifyToastConfig = {
    timeout: 2000,
    showProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    position: SnotifyPosition.rightTop,
    type: SnotifyStyle.error
  };

  @Input() guessNets: GuessNet[];
  @Input() edit = false;
  @Input() onlyView = false;
  submitted = false;

  netForm = this.formBuilder.group({
    numHosts: ['', Validators.required],
    numRed: ['', Validators.required],
    force: false
  });

  constructor(private formBuilder: FormBuilder,
              private activeModal: NgbActiveModal,
              private snotifyService: SnotifyService) {
  }

  submit(): void {
    this.submitted = true;
    if (this.netForm.valid) {
      this.addNet({
        hosts: this.netForm.get('numHosts').value,
        total: this.netForm.get('numRed').value,
        adjust: this.netForm.get('force').value
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
      if (this.guessNets.length > 0) {
        this.activeModal.close(this.guessNets);
      } else {
        this.snotifyService.create({
          title: 'Error',
          body: 'Debe agregar alguna red',
          config: this.snotifyConfig
        });
      }
    } else {
      this.activeModal.close();
    }
  }

  delteNet(index): void {
    this.guessNets.splice(index, 1);
  }
}

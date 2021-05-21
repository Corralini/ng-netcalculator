import {Component, Input} from '@angular/core';
import {GuessNet} from '../../../../models/guess-net.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SnotifyPosition, SnotifyService, SnotifyStyle} from 'ng-snotify';
import {SnotifyToastConfig} from 'ng-snotify/lib/interfaces/snotify-toast-config.interface';
import {Net} from '../../../../models/net.model';
import {faCheck, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {getNetsByMask, getOptimizedMask, getSearchNets, setNetUsed} from '../../../../utils/ip-uils';

@Component({
  selector: 'app-select-net-modal',
  templateUrl: './select-net-modal.component.html',
  styleUrls: ['./select-net-modal.component.css']
})
export class SelectNetModalComponent {

  faCheck = faCheck;
  faBack = faChevronLeft;

  snotifyConfig: SnotifyToastConfig = {
    timeout: 2000,
    showProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    position: SnotifyPosition.rightTop,
    type: SnotifyStyle.error
  };
  @Input() guessNets: GuessNet[];

  @Input() allNet: Net;
  selectGuessNet: GuessNet;
  selectNet: Net;
  avaliableNets: Net[];
  searchText = '';

  constructor(private activeModal: NgbActiveModal,
              private snotifyService: SnotifyService) {
  }

  close(send = false): void {
    if (send) {
      if (this.selectNet) {
        this.selectGuessNet.total--;
        setNetUsed(this.allNet, this.selectNet.ip, this.selectNet.mask);
        this.activeModal.close(this.selectNet);
      } else {
        this.snotifyService.create({
          title: 'Error',
          body: 'Debe seleccionar una red',
          config: this.snotifyConfig
        });
      }
    } else {
      this.activeModal.close();
    }
  }

  setSelectGuessNet(net: GuessNet): void {
    this.selectGuessNet = net;
    getNetsByMask(this.allNet, getOptimizedMask(this.selectGuessNet.hosts, this.selectGuessNet.adjust));
    this.avaliableNets = getSearchNets();
  }

  setSelectNet(net: Net): void {
    this.selectNet = net;
  }

  back(): void {
    this.selectNet = undefined;
    this.selectGuessNet = undefined;
  }
}

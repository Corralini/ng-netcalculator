import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
// @ts-ignore
import copy from 'copy-to-clipboard';
import {SnotifyPosition, SnotifyService, SnotifyStyle} from 'ng-snotify';
import {SnotifyToastConfig} from 'ng-snotify/lib/interfaces/snotify-toast-config.interface';

@Component({
  selector: 'app-packet-tracer-modal',
  templateUrl: './packet-tracer-modal.component.html',
  styleUrls: ['./packet-tracer-modal.component.css']
})
export class PacketTracerModalComponent {

  @Input() config: string;

  snotifyConfig: SnotifyToastConfig = {
    timeout: 2000,
    showProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    position: SnotifyPosition.rightTop,
    type: SnotifyStyle.success
  };

  constructor(private activeModal: NgbActiveModal,
              private snotifyService: SnotifyService) {
  }

  close(): void {
    this.activeModal.close();
  }

  copyClipBoard(): void {
    copy(this.config, {
      format: 'text/plain'
    });
    this.snotifyService.create({
      title: 'Éxito',
      body: 'Texto copiado al portapapeles',
      config: this.snotifyConfig
    });
  }
}

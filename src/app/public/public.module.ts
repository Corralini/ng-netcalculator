import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PublicComponent} from './public.component';
import {NetComponent} from './net/net.component';
import {ModalComponent} from './net/modal/modal.component';
import {NgbAccordionModule, NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SchemaComponent} from './net/schema/schema.component';
import { SelectNetModalComponent } from './net/schema/select-net-modal/select-net-modal.component';
import { PacketTracerModalComponent } from './net/schema/packet-tracer-modal/packet-tracer-modal.component';


@NgModule({
  declarations: [
    PublicComponent,
    NetComponent,
    ModalComponent,
    SchemaComponent,
    SelectNetModalComponent,
    PacketTracerModalComponent
  ],
  exports: [
    PublicComponent
  ],
  imports: [
    CommonModule,
    NgbButtonsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbAccordionModule,
  ]
})
export class PublicModule {
}

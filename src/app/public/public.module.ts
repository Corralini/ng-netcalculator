import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PublicComponent} from './public.component';
import {NetComponent} from './net/net.component';
import {ModalComponent} from './net/modal/modal.component';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SchemaComponent} from './net/schema/schema.component';


@NgModule({
  declarations: [
    PublicComponent,
    NetComponent,
    ModalComponent,
    SchemaComponent
  ],
  exports: [
    PublicComponent
  ],
  imports: [
    CommonModule,
    NgbButtonsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ]
})
export class PublicModule {
}

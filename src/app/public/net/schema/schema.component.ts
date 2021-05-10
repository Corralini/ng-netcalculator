import {Component, Input, OnInit} from '@angular/core';
import {Net} from '../../../models/net';
import {GuessNet} from '../../../models/guess-net';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.css']
})
export class SchemaComponent implements OnInit {

  @Input() nets: Net;
  @Input() guessNet: GuessNet[];
  letras = [...'abcdefghijklmnopkrstuwxyz'];
  idxLetters = 0;
  idxNet = 1;
  constructor() { }

  ngOnInit(): void {
  }

}

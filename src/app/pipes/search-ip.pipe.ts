import {Pipe, PipeTransform} from '@angular/core';
import {Net} from '../models/net.model';

@Pipe({name: 'searchIp'})
export class SearchIpPipe implements PipeTransform {
  transform(items: Net[], searchIp: string): any {
    if (!items) {
      return [];
    }

    if (!searchIp) {
      return items;
    }
    searchIp = searchIp.toLocaleLowerCase();
    return items.filter(value => value.ip.toLocaleLowerCase().includes(searchIp));
  }
}

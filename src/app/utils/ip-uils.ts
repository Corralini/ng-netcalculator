import {Net} from '../models/net';
import {binaryToDecimal} from './binary-utils';
import {arrayToString} from './array-utils';

export const typeA = 'A';
export const typeB = 'B';
export const typeC = 'C';

export function generateStates(lenght: number, max: number, broadcast: boolean = false): string [] {
  const states: string[] = [];

  const maxDecimal = parseInt('1'.repeat(lenght - 1), 2);
  if (maxDecimal) {
    for (let i = 0; i <= maxDecimal; i++) {
      // Convert to binary, pad with 0, and add to final results
      states.push(i.toString(2).padStart(lenght - 1, '0') + (broadcast ? '1' : '0').repeat(max - lenght + 1));
    }
  } else {
    states.push((broadcast ? '1' : '0').repeat(max));
  }


  return states;

}

export function calculateNextIp(ip: string): string {
  const ipSplitted = ip.split('.');
  let p1 = parseInt(ipSplitted[0], 10);
  let p2 = parseInt(ipSplitted[1], 10);
  let p3 = parseInt(ipSplitted[2], 10);
  let p4 = parseInt(ipSplitted[3], 10);
  if (p4 === 255) {
    if (p3 === 255) {
      if (p2 === 255) {
        if (p1 === 255) {
          return null;
        } else {
          p1 += 1;
          p2 = 0;
          p3 = 0;
          p4 = 0;
        }
      } else {
        p2 += 1;
        p3 = 0;
        p4 = 0;
      }
    } else {
      p3 += 1;
      p4 = 0;
    }
  } else {
    p4 += 1;
  }

  return p1 + '.' + p2 + '.' + p3 + '.' + p4;
}

export function calculatePreviousIp(ip: string): string {
  const ipSplitted = ip.split('.');
  let p1 = parseInt(ipSplitted[0], 10);
  let p2 = parseInt(ipSplitted[1], 10);
  let p3 = parseInt(ipSplitted[2], 10);
  let p4 = parseInt(ipSplitted[3], 10);
  if (p4 === 0) {
    if (p3 === 0) {
      if (p2 === 0) {
        if (p1 === 0) {
          return null;
        } else {
          p1 -= 1;
          p2 = 255;
          p3 = 255;
          p4 = 255;
        }
      } else {
        p2 -= 1;
        p3 = 255;
        p4 = 255;
      }
    } else {
      p3 -= 1;
      p4 = 255;
    }
  } else {
    p4 -= 1;
  }

  return p1 + '.' + p2 + '.' + p3 + '.' + p4;
}

export function getIpType(ip: string): string {
  const first = parseInt(ip.split('.')[0], 10);
  if (first >= 1 && first <= 126) {
    return typeA;
  } else if (first >= 128 && first <= 191) {
    return typeB;
  } else {
    return typeC;
  }
}

export function generateSubIp(parseIp: string, parseMask: number, first = true): Net {
  if (parseMask <= 30) {
    const net = {
      ip: parseIp,
      mask: parseMask,
      used: false,
      childs: []
    };
    console.log('ip:', parseIp, 'mask:', parseMask);
    if (parseMask >= 24) {
      const netBytes = parseMask - 24;
      const staticPartIp = parseIp.split('.');
      let binary = parseInt(staticPartIp[3], 10).toString(2);
      binary = '0'.repeat(8 - binary.length) + binary;
      console.log(binary);
      staticPartIp[staticPartIp.length - 1] = binaryToDecimal(binary).toString();
      const firstIp = staticPartIp[0] + '.' + staticPartIp[1] + '.' + staticPartIp[2] + '.' + staticPartIp[3];
      console.log('firstIp', firstIp);
      const firstNet = generateSubIp(firstIp, parseMask + 1, false);
      if (firstNet) {
        net.childs.push(generateSubIp(firstIp, parseMask + 1, false));
      }
      if (!first) {
        const secondBinary = [...binary];
        secondBinary[parseMask - 24 - 1] = '1';

        staticPartIp[staticPartIp.length - 1] = binaryToDecimal(arrayToString(secondBinary)).toString();
        const secondIp = staticPartIp[0] + '.' + staticPartIp[1] + '.' + staticPartIp[2] + '.' + staticPartIp[3];
        console.log('secondIP', secondIp);
        const secondNet = generateSubIp(secondIp, parseMask + 1, false);
        if (secondNet) {
          net.childs.push(generateSubIp(secondIp, parseMask + 1, false));
        }
      }

    } else if (parseMask >= 16 && parseMask < 24) {
      const netBytes = parseMask - 16;
      const binary = ('1'.repeat(netBytes) + '0'.repeat(8 - (netBytes))) + '.' + ('0'.repeat(8));
      console.log(binary);
    } else if (parseMask >= 8 && parseMask < 16) {
      const netBytes = parseMask - 8;
      const binary = ('1'.repeat(netBytes) + '0'.repeat(8 - netBytes)) + '.' + ('0'.repeat(8)) + '.' + ('0'.repeat(8));
      console.log(binary);
    }
    return net;
  }
  return undefined;
}

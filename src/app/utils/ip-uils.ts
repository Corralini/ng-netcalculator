import {Net} from '../models/net';
import {binaryToDecimal, decimalToBinary} from './binary-utils';
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

export function generateSubIp(parseIp: string, parseMask: number): Net {
  if (parseMask <= 30) {
    const net: Net = {
      ip: parseIp,
      mask: parseMask,
      used: false,
      childs: []
    };
    console.log('ip:', parseIp, 'mask:', parseMask);
    if (parseMask >= 24) {
      net.broadcast = calculateBroadcast(parseIp, parseMask);
      const netBytes = parseMask - 24;
      const staticPartIp = parseIp.split('.');
      const binary = decimalToBinary(parseInt(staticPartIp[3], 10), 8);
      console.log(binary);
      staticPartIp[staticPartIp.length - 1] = binaryToDecimal(binary).toString();
      const firstIp = staticPartIp[0] + '.' + staticPartIp[1] + '.' + staticPartIp[2] + '.' + staticPartIp[3];
      console.log('firstIp', firstIp);
      const firstNet = generateSubIp(firstIp, parseMask + 1);
      if (firstNet) {
        net.childs.push(generateSubIp(firstIp, parseMask + 1));
      }
      const secondBinary = [...binary];
      secondBinary[parseMask - 24 - 1] = '1';

      staticPartIp[staticPartIp.length - 1] = binaryToDecimal(arrayToString(secondBinary)).toString();
      const secondIp = staticPartIp[0] + '.' + staticPartIp[1] + '.' + staticPartIp[2] + '.' + staticPartIp[3];
      console.log('secondIP', secondIp);
      const secondNet = generateSubIp(secondIp, parseMask + 1);
      if (secondNet) {
        net.childs.push(generateSubIp(secondIp, parseMask + 1));
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

export function calculateBroadcast(ip: string, mask: number): string {
  const type = getIpType(ip);
  let broadcast: string;
  if (type === typeC) {
    let changePart = [...decimalToBinary(parseInt(ip.split('.')[3], 10), 8)];
    const hostPart = 32 - mask;
    changePart = changePart.filter((value, index) => {
      return index > 8 - hostPart;
    });
    console.log('Quitar 0', changePart);
    broadcast = arrayToString(changePart) + '1'.repeat(8 - changePart.length);
    console.log('add 1', broadcast);
    broadcast = binaryToDecimal(broadcast).toString();
    console.log('decimal', broadcast);
  }
  return broadcast;
}
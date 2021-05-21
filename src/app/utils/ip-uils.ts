import {Net} from '../models/net.model';
import {binaryToDecimal, decimalToBinary} from './binary-utils';
import {arrayToString} from './array-utils';

export const typeA = 'A';
export const typeB = 'B';
export const typeC = 'C';

let searchNets: Net[] = [];

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
    net.broadcast = calculateBroadcast(parseIp, parseMask);
    net.ipRouter = calculateNextIp(parseIp);
    net.firstIp = calculateNextIp(net.ipRouter);
    net.lastIp = calculatePreviousIp(net.broadcast);
    net.decimalMask = calculateDecimalMask(parseMask);
    const staticPartIp = parseIp.split('.');
    if (parseMask >= 24) {
      const binary = decimalToBinary(parseInt(staticPartIp[3], 10), 8);
      staticPartIp[staticPartIp.length - 1] = binaryToDecimal(binary).toString();
      const firstIp = staticPartIp[0] + '.' + staticPartIp[1] + '.' + staticPartIp[2] + '.' + staticPartIp[3];
      const firstNet = generateSubIp(firstIp, parseMask + 1);
      if (firstNet) {
        net.childs.push(firstNet);
      }
      const secondBinary = [...binary];
      secondBinary[parseMask - 24] = '1';

      staticPartIp[staticPartIp.length - 1] = binaryToDecimal(arrayToString(secondBinary)).toString();
      const secondIp = staticPartIp[0] + '.' + staticPartIp[1] + '.' + staticPartIp[2] + '.' + staticPartIp[3];
      const secondNet = generateSubIp(secondIp, parseMask + 1);
      if (secondNet) {
        net.childs.push(secondNet);
      }

    } else if (parseMask >= 16 && parseMask < 24) {
      const binary = decimalToBinary(parseInt(staticPartIp[2], 10), 8);
      staticPartIp[staticPartIp.length - 2] = binaryToDecimal(binary).toString();
      const firstIp = staticPartIp[0] + '.' + staticPartIp[1] + '.' + staticPartIp[2] + '.' + staticPartIp[3];
      const firstNet = generateSubIp(firstIp, parseMask + 1);
      if (firstNet) {
        net.childs.push(firstNet);
      }

      const secondBinary = [...binary];
      secondBinary[parseMask - 16] = '1';
      staticPartIp[staticPartIp.length - 2] = binaryToDecimal(arrayToString(secondBinary)).toString();
      const secondIp = staticPartIp[0] + '.' + staticPartIp[1] + '.' + staticPartIp[2] + '.' + staticPartIp[3];
      const secondNet = generateSubIp(secondIp, parseMask + 1);
      if (secondNet) {
        net.childs.push(secondNet);
      }

    } else if (parseMask >= 8 && parseMask < 16) {
      const binary = decimalToBinary(parseInt(staticPartIp[1], 10), 8);
      staticPartIp[staticPartIp.length - 3] = binaryToDecimal(binary).toString();
      const firstIp = staticPartIp[0] + '.' + staticPartIp[1] + '.' + staticPartIp[2] + '.' + staticPartIp[3];
      const firstNet = generateSubIp(firstIp, parseMask + 1);
      if (firstNet) {
        net.childs.push(firstNet);
      }

      const secondBinary = [...binary];
      secondBinary[parseMask - 8] = '1';
      staticPartIp[staticPartIp.length - 3] = binaryToDecimal(arrayToString(secondBinary)).toString();
      const secondIp = staticPartIp[0] + '.' + staticPartIp[1] + '.' + staticPartIp[2] + '.' + staticPartIp[3];
      const secondNet = generateSubIp(secondIp, parseMask + 1);
      if (secondNet) {
        net.childs.push(secondNet);
      }
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
      return index < (8 - hostPart);
    });
    broadcast = ip.split('.')[0] + '.' + ip.split('.')[1] + '.' + ip.split('.')[2] + '.'
      + binaryToDecimal(arrayToString(changePart) + '1'.repeat(8 - changePart.length)).toString();
  } else if (type === typeB) {
    let changePart = [...decimalToBinary(parseInt(ip.split('.')[2], 10), 8)];
    const hostPart = 24 - mask;
    changePart = changePart.filter((value, index) => {
      return index < (8 - hostPart);
    });
    broadcast = ip.split('.')[0] + '.' + ip.split('.')[1] + '.'
      + binaryToDecimal(arrayToString(changePart) + '1'.repeat(8 - changePart.length)).toString() + '.'
      + binaryToDecimal('1'.repeat(8 ).toString());
  } else if (type === typeA) {
    let changePart = [...decimalToBinary(parseInt(ip.split('.')[1], 10), 8)];
    const hostPart = 16 - mask;
    changePart = changePart.filter((value, index) => {
      return index < (8 - hostPart);
    });
    broadcast = ip.split('.')[0] + '.'
      + binaryToDecimal(arrayToString(changePart) + '1'.repeat(8 - changePart.length)).toString() + '.'
      + binaryToDecimal('1'.repeat(8 ).toString()) + '.' + binaryToDecimal('1'.repeat(8 ).toString());
  }
  return broadcast;
}

export function calculateDecimalMask(mask: number): string {
  const binary = '1'.repeat(mask) + '0'.repeat(32 - mask);
  return binaryToDecimal(binary.slice(0, 8)) + '.' + binaryToDecimal(binary.slice(8, 16))
    + '.' + binaryToDecimal(binary.slice(16, 24)) + '.' + binaryToDecimal(binary.slice(24, 32));
}

export function getNetsByMask(net: Net, searchMask: number, first = true): void {
  if (first) {
    searchNets = [];
  }

  if (net.mask !== searchMask) {
    net.childs.forEach(child => getNetsByMask(child, searchMask, false));
  } else {
    if (!net.used) {
      searchNets.push(net);
    }
  }
}

export function getSearchNets(): Net[] {
  return [...searchNets];
}

export function setNetUsed(net: Net, ip: string, mask: number, use = true): void {

  if (net.ip !== ip || net.mask !== mask) {
    net.childs.forEach(child => setNetUsed(child, ip, mask, use));
    const childUsed = net.childs.filter(child => child.used);
    if (childUsed && childUsed.length > 0) {
      net.used = use;
    }
  } else {
    net.used = use;
    setAllChildsUsed(net);
  }
}


export function getOptimizedMask(numHosts: number, forceAdjust?: boolean): number {
  let countByteHosts = 0;
  let pow = Math.pow(2, countByteHosts) - 2;
  if (forceAdjust) {
    while (pow <= numHosts) {
      countByteHosts++;
      pow = Math.pow(2, countByteHosts);
    }
  } else {
    while (pow <= numHosts) {
      countByteHosts++;
      pow = Math.pow(2, countByteHosts) - 2;
    }
  }

  return 32 - countByteHosts;
}

export function setAllChildsUsed(net: Net, used = true): void {
  net.used = used;
  net.childs.forEach(value => setAllChildsUsed(value, used));
}


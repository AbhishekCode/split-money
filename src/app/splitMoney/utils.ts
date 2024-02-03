import { isNumber } from "lodash";

export function getAmountValue(
  total: string | number,
  participantCount: number = 1
) {
  const totalAmount = isNumber(total) ? total : parseInt(total) || 0;

  return Math.round((totalAmount / participantCount) * 100) / 100;
}

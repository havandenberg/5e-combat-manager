export function getModifier(stat) {
  if (!stat) {return false;}
  return `${stat > -1 ? '+' : '-'}${Math.ceil(stat / 2 - 5)}`;
}

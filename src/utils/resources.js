export function getModifier(stat) {
  if (!stat) {return false;}
  const score = Math.floor(stat / 2) - 5;
  return `${score > -1 ? '+' : ''}${score}`;
}

import Scroll from 'react-scroll';

export function getModifier(stat) {
  if (!stat) {return false;}
  const score = Math.floor(stat / 2) - 5;
  return `${score > -1 ? '+' : ''}${score}`;
}

export function scrollTo(y = 0, x = 0) {
  window.scrollTo(x, y);
}

export function smoothScrollTo(position) {
  const scroll = Scroll.animateScroll;
  const options = {
    duration: 300,
    smooth: true
  };
  switch (position) {
  case 'top':
    scroll.scrollToTop(options);
    break;
  case 'bottom':
    scroll.scrollToBottom(options);
    break;
  default:
    scroll.scrollTo(position, options);
  }
}

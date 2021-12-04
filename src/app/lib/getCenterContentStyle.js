import { getContentWidth } from './getContentWidth';

let centerContentStyle = {};

function onResize() {
    const contentWidth = getContentWidth();
    centerContentStyle = {
        width: `${contentWidth}px`,
        margin: `0 ${(window.innerWidth - contentWidth) / 2}px`
    };
}

onResize();

window.addEventListener('resize', onResize);

export function getCenterContentStyle() {
    return centerContentStyle;
}
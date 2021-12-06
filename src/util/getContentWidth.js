import { contentWidthFromVW, maxContentWidth } from '../constants';

export function getContentWidth() {
    return Math.min(maxContentWidth, Math.round(contentWidthFromVW * window.innerWidth));
}
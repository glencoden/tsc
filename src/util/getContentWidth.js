import { CONTENT_WIDTH_FROM_VW, MAX_CONTENT_WIDTH } from '../constants';

export function getContentWidth() {
    return Math.min(MAX_CONTENT_WIDTH, Math.round(CONTENT_WIDTH_FROM_VW * window.innerWidth));
}
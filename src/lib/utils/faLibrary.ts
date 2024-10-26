import { dom, library } from '@fortawesome/fontawesome-svg-core';
import {
	faBars,
	faBold,
	faEllipsisH,
	faItalic,
	faStrikethrough,
	faUnderline,
} from '@fortawesome/free-solid-svg-icons';

library.add(faBars, faBold, faEllipsisH, faItalic, faStrikethrough, faUnderline);
dom.watch();

import {DirectiveReplaceInfo, ReactComponentOptions} from '../index';
import {ASTElement} from './parse-template';
import searchNgAttr from './search-ng-attr';

export default function setReactTagName (el: ASTElement, {replaceDirectives}: ReactComponentOptions) {
    const {attribs, name} = el;

    if (attribs && replaceDirectives) {
        const directiveInfo: DirectiveReplaceInfo = searchNgAttr(name, replaceDirectives);

        if (directiveInfo) {
            el.reactTagName = directiveInfo.tagName;
            return;
        }

        for (const name in attribs) {
            if (Object.prototype.hasOwnProperty.call(attribs, name)) {
                const directiveInfo: DirectiveReplaceInfo = searchNgAttr(name, replaceDirectives);

                if (directiveInfo) {
                    el.reactTagName = directiveInfo.tagName;
                    return;
                }
            }
        }
    }
}
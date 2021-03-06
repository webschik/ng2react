import * as prettier from 'prettier';
import transformController from './transformer/transform-controller';
import transformTemplate from './transformer/transform-template';
import {pureComponentType, ReactComponentType} from './react';

export interface DirectiveToTagInfo {
    tagName: string;
    valueProp?: string;
}

export interface DirectiveToTextNodeInfo {
    callee?: string;
    calleeArguments?: string[];
}

export interface AngularInterpolateOptions {
    startSymbol: string;
    endSymbol: string;
    bindOnce: string;
}

export interface AngularControllerOptions {
    name: string;
    code: string;
}

export interface AngularTemplateOptions {
    code: string;
}

export interface ComponentOptions {
    componentName: string;
    componentType?: ReactComponentType;
    template?: AngularTemplateOptions;
    controller?: AngularControllerOptions;
}

export interface TransformOptions {
    components: ComponentOptions[];
    directivesToTags?: {
        [key: string]: DirectiveToTagInfo;
    };
    directivesToTextNodes?: {
        [key: string]: DirectiveToTextNodeInfo;
    };
    react?: {
        typescript?: boolean;
        prettier?: prettier.Options;
    };
    angular?: {
        interpolate: Partial<AngularInterpolateOptions>;
    };
}

export interface GeneratedComponent {
    code: string;
}

export function transform (options: TransformOptions): GeneratedComponent[] {
    const transformOptions: TransformOptions = Object.assign({}, options, {
        angular: Object.assign({}, options.angular, {
            interpolate: Object.assign({
                startSymbol: '{{',
                endSymbol: '}}',
                bindOnce: '::'
            }, options.angular && options.angular.interpolate)
        }),
        react: Object.assign({
            typescript: false
        }, options.react),
        directivesToTags: Object.assign({
            'ng-view': {
                tagName: 'Switch'
            },
            'ui-sref': {
                tagName: 'NavLink',
                valueProp: 'to'
            }
        }, options.directivesToTags),
        directivesToTextNodes: Object.assign({}, options.directivesToTextNodes)
    });
    const {typescript} = transformOptions.react;

    return transformOptions.components.map((componentOptions: ComponentOptions) => {
        const {template, controller, componentName, componentType = pureComponentType} = componentOptions;
        let jsxResult: string = 'null';
        let componentCode: string;

        if (template) {
            jsxResult = transformTemplate(template, transformOptions);
        }

        if (controller) {
            componentCode = transformController(componentOptions, jsxResult, transformOptions);
        } else {
            componentCode = `
                ${ componentType === 'stateless' ? (
                    `export interface ${ componentName }Props {
                        [key: string]: any;
                    }

                    const ${ componentName }${ typescript ?
                        `: React.StatelessComponent<${ componentName }Props>` : ''
                    } = (props) => {
                        return ${ jsxResult };
                    };

                    export default ${ componentName };
                `) : (`
                    export interface ${ componentName }Props {
                        [key: string]: any;
                    }

                    export interface ${ componentName }State {
                        [key: string]: any;
                    }

                    export default class ${ componentName } extends React.PureComponent${ typescript ?
                        `<${ componentName }Props, ${ componentName }State>` : ''
                    } {
                        render () {
                            return ${ jsxResult };
                        }
                    }
                `)}
            `;
        }

        const code: string = prettier.format(`
            ${ typescript ? 'import * as React from \'react\';' : 'import React from \'react\';'}
            ${ componentCode }
            `, Object.assign({
            printWidth: 120,
            tabWidth: 4,
            useTabs: false,
            semi: true,
            singleQuote: true,
            trailingComma: 'none',
            bracketSpacing: false,
            jsxBracketSameLine: true,
            arrowParens: 'always',
            parser: typescript ? 'typescript' : 'babylon'
        }, transformOptions.react && transformOptions.react.prettier));

        return {
            code
        };
    });
}
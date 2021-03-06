import * as React from 'react';

export interface TestComponentProps {
    [key: string]: any;
}

export interface TestComponentState {
    [key: string]: any;
}

export default class TestComponent extends React.PureComponent<TestComponentProps, TestComponentState> {
    render() {
        return [
            orders.map((order, index: number) => {
                return (
                    <div key={`item-${index}child-0`}>
                        <span>{order.name}</span>
                    </div>
                );
            }),
            types.map((type, index: number, list) => {
                return [
                    <header key={`item-${index}child-2`}>Header {type}</header>,
                    <aside
                        key={`item-${index}child-4`}
                        className="sidebar"
                        className={index % 2 ? 'sidebar_odd' : undefined}>
                        Sidebar
                    </aside>,
                    <div key={`item-${index}child-6`} className="body" className={index % 2 ? undefined : 'body_even'}>
                        Body {type}
                    </div>,
                    <footer key={`item-${index}child-8`}>Footer {list.length}</footer>
                ];
            }),
            <div key="child-10">
                {list.map((item, index: number) => {
                    return <div key={`item-${index}`} />;
                })}
                <p />
                {list2.map((item2, index: number) => {
                    return [
                        <span key={`item-${index}child-5`} />,
                        <div key={`item-${index}child-7`} />,
                        list3.map((item3, index: number) => {
                            return [<span key={`item-${index}child-9`} />, <span key={`item-${index}child-11`} />];
                        }),
                        <div key={`item-${index}child-13`} />,
                        <span key={`item-${index}child-15`} />
                    ];
                })},
                <div />
            </div>
        ];
    }
}

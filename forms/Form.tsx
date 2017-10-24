import * as React from "react";
import * as $ from "jquery";

import { Request } from "./Request";

export interface FormProps{
    caption?: string;
    on: any;
    isMobile?: boolean;
};

interface FormState {
    isMobile?: boolean;
}

const PREDEFMEDIA_isDesktopMediaQuery = window.matchMedia("only all and (min-width: 961px)");

export class Form extends React.Component<FormProps, FormState> {
    childRefs: Request[] = [];
    divFormContainer: HTMLDivElement;

    constructor(props: any) {
        super(props);
        this.state = {
            isMobile: props.isMobile || !PREDEFMEDIA_isDesktopMediaQuery.matches
        }
    }

    processForm() {
        var data: any = { };
        this.childRefs.forEach((child) => {
            if (child && child.props && child.props.formkey)
                data[child.props.formkey] = child.getValue();
        });

        return data;
    }

    componentDidMount(): any {
        $(this.divFormContainer).keypress((event) => {
            if (event.which == 13 && !event.shiftKey) {
                this.props.on.submit(this.processForm(), () => {this.clear();});
                return false;
            }
            return true;
        });

        if (!this.props.isMobile) {
            PREDEFMEDIA_isDesktopMediaQuery.addListener(() => {
                this.setState({
                    isMobile: !PREDEFMEDIA_isDesktopMediaQuery.matches
                });
            });
        }
    }

    clear(): void {
        this.childRefs.forEach(ref => ref.clear());
    }

    render() {
        var res: any = [];

        var id = 0;
        React.Children.forEach(this.props.children, (child: any) => {
            var config: any = {
                key: "form" + (id++),

                onClick: () => {
                    if (item.props.type == "submit") {
                        this.props.on.submit(this.processForm(), () => {this.clear();});
                    } else if (item.props.type == "cancel")
                        this.props.on.cancel();
                    
                    if (child.props.onClick) child.props.onClick();
                },

                ref: (element: Request) => {
                    if (!element) return;
                    this.childRefs.push(element);
                }
            };

            if (child.type.name == 'Request')
                config.isMobile = this.state.isMobile;

            var item: any = React.cloneElement(child, config);

            res.push(item);
        });

        return (
            <div ref={(res: HTMLDivElement) => {this.divFormContainer = res;}}>
                { this.props.caption ? <h3 style={{marginTop: "10px"}}>{this.props.caption}</h3> : "" }
                {res}
                <div style={{clear: "both"}} />
            </div>
        );
    }
}
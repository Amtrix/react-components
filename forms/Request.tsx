import * as React from "react";
import * as $ from "jquery";

export interface RequestProps{
    type: string;
    label: string;
    onClick?: () => void;
    formkey?: string;
    ref?: any;
    defaultValue?: any;
    width?: string;
    noFloat?: boolean;
    marginTop?: string;
    isMobile?: boolean;
    mobileFullWidth?: boolean;
};

interface RequestState {
    subVisible: boolean;
}

export class Request extends React.Component<RequestProps, RequestState> {
    valueContainer: any;
    childRefs: Request[] = [];

    constructor(props: any) {
        super(props);
        this.state = {
            subVisible: props.defaultValue
        }
    }

    clear(): void {
        switch (this.props.type) {
            case "text":
            case "password":
            case "textarea":
                $(this.valueContainer).val("");
        }
    }

    getValue(): any {
        switch (this.props.type) {
            case "text":
            case "password":
            case "textarea":
                return $(this.valueContainer).val();
            case "optional":
                return {
                    selected: this.state.subVisible,
                    value: this.childRefs.reduce((map:any, obj:any) => {
                        map[obj.props.formkey] = obj.getValue();
                        return map;
                    }, {})
                }
            case "image":
                return $(this.valueContainer).attr("src");
            default:
                return "";
        }
    };

    componentDidMount(): any {
        switch (this.props.type) {
            case "text":
            case "password":
            case "textarea":
                $(this.valueContainer).val(this.props.defaultValue);
                break;
            case "optional":
                $(this.valueContainer).prop('checked', this.state.subVisible);
                break;
        }
    }

    render() {
        var res: JSX.Element = <div/>;
        switch (this.props.type) {
            case "text":
            case "password":
                res = 
                    <div>
                        <label>{this.props.label}</label>
                        <br/>
                        <input type={this.props.type}
                               className={"form-control"}
                               ref={(element: any) => { this.valueContainer = element; }} />
                        <div style={{clear: "both"}}></div>
                    </div>
                break;
            case "textarea":
                var css: any = {width: "100%", height: "80px", resize: "none"}; 
                if (this.props.marginTop) css.marginTop = this.props.marginTop;
                res =
                    <div>
                        <textarea className="form-control" style={css} ref={(elem) => this.valueContainer = elem } />
                    </div>
                break;
            case "submit":
            case "cancel":
            case "button":
                var css: any = {marginLeft: "1%", verticalAlign: "initial"};
                if (!this.props.noFloat) css.float = "right";
                if (this.props.width) css.minWidth = this.props.width;
                if (this.props.marginTop) css.marginTop = this.props.marginTop;
                if (this.props.isMobile && this.props.mobileFullWidth) css.minWidth = "100%";

                    res = <input className={"btn btn-default"} type="button" value={this.props.label}
                           style={css} onClick={() => {
                                if (this.props.onClick) this.props.onClick();
                          }}/>;
                break;
            case "image":
                var path = "/no-image.jpg";
                if (this.props.defaultValue) path = this.props.defaultValue;
                res =
                    <div>
                        <label>{this.props.label}</label>
                        <img src={path} style={{marginLeft: "8px", maxWidth: "200px", maxHeight: "200px", cursor: "pointer", border: "solid thin rgb(200,200,200)", display: "block"}}
                             ref={(elem) => this.valueContainer = elem } onClick={() => {
                                if (this.props.onClick) this.props.onClick();
                          }}/>;
                    </div>
                break;
            case "optional":
                var id = 0;
                var subform: JSX.Element = <div />;
                React.Children.forEach(this.props.children, (child: any) => {
                    if (!child) return;
                    
                    var item: any = React.cloneElement(child, {
                        key: "sub-request" + (id++),

                        ref: (element: Request) => {
                            if (!element) return;
                            this.childRefs.push(element);
                        }
                    });

                    subform =
                        <div style={{marginLeft: "1%"}}>
                            {item}
                        </div>;
                });

                res = 
                    <div>
                        <div className={"checkbox"}>
                            <label>
                                <input type="checkbox" ref={(elem) => this.valueContainer = elem } onChange={() => {
                                    this.setState({subVisible: !this.state.subVisible}, () => {
                                    });
                                }}/>
                                {this.props.label}
                            </label>
                        </div>
                        {this.state.subVisible ? subform : <div/>}
                    </div>
        }

        return <div style={{}}> {res} </div>;
    };
}
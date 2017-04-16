import * as React from "react";


export interface NewZLevelProps {
    zIndex: number;
};

export class NewZLevel extends React.Component<NewZLevelProps, {}> {
    render() {
        return (
            <div style={{position: "absolute", left: "0px", right: "0px", zIndex: this.props.zIndex}} >
                {this.props.children}
            </div>
        );
    }
}
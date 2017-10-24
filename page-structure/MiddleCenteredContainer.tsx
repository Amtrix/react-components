import * as React from "react";

export interface MiddleCenteredContainerProps {
    containerWidth?: string;
    containerMaxWidth?: string;
};

export class MiddleCenteredContainer extends React.Component<MiddleCenteredContainerProps, {}> {
    render() {
        return (
            <div>
                <div style={{textAlign: "center"}}>
                    <div style={{display: "inline-block", width: this.props.containerWidth, maxWidth: this.props.containerMaxWidth}}>
                        <div style={{textAlign: "left"}}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
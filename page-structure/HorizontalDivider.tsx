import * as React from "react";

export namespace PageStructure {

    export interface MiddleCenteredContainerProps {
        containerWidth: string;
    };

    export class MiddleCenteredContainer extends React.Component<MiddleCenteredContainerProps, {}> {
        render() {
            return (
                <div>
                    <div style={{textAlign: "center"}}>
                        <div className={"mainContainer"} style={{width: this.props.containerWidth}}>
                            <div style={{textAlign: "left"}}>
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
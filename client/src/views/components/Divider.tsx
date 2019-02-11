import * as React from "react";
import styled, { css } from "styled-components";

interface Props {
    className?: string;
    isVertical?: boolean;
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    gridArea?: string;
}

class Divider extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        const {
            className,
        } = this.props;

        return (
            <hr id="divider" className={className}/>
        );
    }
}

export default styled(Divider)`
    ${(props) => props.isVertical ? css`min-width: 1px` : css`min-height: 1px`};
    grid-area: ${(props) => props.gridArea};
    background-color: ${(props) => props.theme.primaryText};
    border: none;
    margin-top: ${(props) => props.top}px;
    margin-right: ${(props) => props.right}px;
    margin-bottom: ${(props) => props.bottom}px;
    margin-left: ${(props) => props.left}px;
`;

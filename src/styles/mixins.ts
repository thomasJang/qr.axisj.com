import { css } from "@emotion/react";
import React from "react";
import { darken } from "../utils/colorUtil";

type FlexDirection = React.CSSProperties["flexDirection"];
type FlexWrap = React.CSSProperties["flexWrap"];
type JustifyContent = React.CSSProperties["justifyContent"];
type AlignItems = React.CSSProperties["alignItems"];

export interface ISMixinFlex {
  direction?: FlexDirection;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  flexWrap?: FlexWrap;
}

export const SMixinFlex = ({
  direction = "row",
  justifyContent = "stretch",
  alignItems = "center",
  flexWrap = "nowrap",
}: ISMixinFlex = {}) => css`
  display: flex;
  flex-wrap: ${flexWrap};
  flex-direction: ${direction};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
`;

export const SMixinFlexRow = (
  justifyContent: JustifyContent = "stretch",
  alignItems: AlignItems = "center",
  flexWrap: FlexWrap = "nowrap",
) => SMixinFlex({ direction: "row", justifyContent, alignItems, flexWrap });

export const SMixinFlexColumn = (
  justifyContent: JustifyContent = "stretch",
  alignItems: AlignItems = "center",
  flexWrap: FlexWrap = "nowrap",
) => SMixinFlex({ direction: "column", justifyContent, alignItems, flexWrap });

export interface SMixinScrollerStyleProps {
  track_color: string;
  thumb_color: string;
}

export const SMixinScrollerStyle = ({ track_color, thumb_color }: SMixinScrollerStyleProps) => css`
  &::-webkit-scrollbar {
    width: 11px;
    height: 11px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${thumb_color};
    border-radius: 6px;
    border: 2px solid ${track_color};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${darken(thumb_color, 0.2)};
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: ${track_color};
  }
  &::-webkit-scrollbar-track:vertical {
    background-color: ${track_color};
  }

  &::-webkit-scrollbar-track:horizontal {
    background-color: ${track_color};
  }

  &::-webkit-scrollbar-corner {
    background-color: ${track_color};
  }
`;

export const SMixinEllipsis = () => css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

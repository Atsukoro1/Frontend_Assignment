"use client";

import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
`;

/** Cream shimmer placeholder shown while API data loads. */
export const Skeleton = styled.span<{ $width?: string; $height?: string }>`
  display: inline-block;
  width: ${({ $width }) => $width ?? "100%"};
  height: ${({ $height }) => $height ?? "1em"};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceMuted} 25%,
    ${({ theme }) => theme.colors.backgroundAlt} 50%,
    ${({ theme }) => theme.colors.surfaceMuted} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s linear infinite;
`;

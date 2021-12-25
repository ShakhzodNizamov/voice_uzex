import styled, { css } from "styled-components";


export const TextWrapper = styled.div`
  width: 400px;
  height: 200px;
  font-size: 30px;
  position: fixed;
  top: 0;
  right: 0;
  background-color: black;
`;

export const body = css`
  &::selection{
      background-color: #ffbf2b;
  }
`;
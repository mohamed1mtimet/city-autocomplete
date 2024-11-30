import styled from "@emotion/styled";

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const LoaderItem = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid #8a8a8a;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: rotate 1.5s linear infinite;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

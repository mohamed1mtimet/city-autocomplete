import styled from "@emotion/styled";

interface SuggestionItemProps {
  isActive: boolean;
}

export const Wrapper = styled.div`
  width: 350px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
  position: relative;
`;

export const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-sizing: border-box;

  &:focus {
    border-color: #0077ff;
    outline: none;
  }
`;

export const SuggestionsList = styled.ul`
  list-style: none;
  margin-top: 10px;
  padding: 10px;
  border-top: none;
  max-height: 150px;
  overflow-y: auto;
  background: white;
  border-radius: 10px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  position: absolute;
  width: 100%;
  box-sizing: border-box;
`;

export const SuggestionItem = styled.li<SuggestionItemProps>`
  padding: 5px 10px;
  cursor: pointer;
  text-align: left;
  border-radius: 10px;
  color: #212121;
  ${({ isActive }) => (isActive ? "background: #f0f2f4;" : "")}
`;
export const ClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 10px;
  font-size: 16px;
  color: #212121;
`;

import { LoaderContainer, LoaderItem } from "./style";

const Loader = () => {
  return (
    <LoaderContainer>
      <LoaderItem data-testid="loader" />
    </LoaderContainer>
  );
};

export default Loader;

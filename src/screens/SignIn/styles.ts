import styled from "styled-components/native";

import { LinearGradient } from "expo-linear-gradient";

const Container = styled(LinearGradient).attrs(({ theme }) => ({
  colors: theme.COLORS.GRADIENT,
}))`
  flex: 1;
  justify-content: center;
`;

export default Container;

import React, {memo} from 'react';
import Container from 'components/Container';
import View from 'components/View';
import HistoryViewModel from './HistoryViewModel';

const History = () => {
  const viewModel = HistoryViewModel();

  return (
    <Container>
      <View />
    </Container>
  );
};

export default memo(History);

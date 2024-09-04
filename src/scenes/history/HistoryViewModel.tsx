import {ReadGames} from 'data/realm/RQL/game';
import {useMemo} from 'react';

const HistoryViewModel = () => {
  const games = ReadGames();

  return useMemo(() => {
    return {games};
  }, [games]);
};

export default HistoryViewModel;

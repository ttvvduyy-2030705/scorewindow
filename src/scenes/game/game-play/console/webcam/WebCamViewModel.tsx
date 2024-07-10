import {useCallback, useMemo} from 'react';

const WebCamViewModel = () => {
  const onRefresh = useCallback(() => {}, []);

  const onDelay = useCallback(() => {}, []);

  const onReWatch = useCallback(() => {}, []);

  return useMemo(() => {
    return {onRefresh, onDelay, onReWatch};
  }, [onRefresh, onDelay, onReWatch]);
};

export default WebCamViewModel;

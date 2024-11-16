import {StyleSheet} from 'react-native';
import {responsiveDimension} from 'utils/helper';

const styles = StyleSheet.create({
  image: {
    width: responsiveDimension(256),
    height: responsiveDimension(128),
    marginRight: responsiveDimension(10),
  },
  absolute: {
    position: 'absolute',
    bottom: responsiveDimension(-512),
  },
  emptyView: {
    width: responsiveDimension(256),
    height: responsiveDimension(128),
  },
});

export default styles;

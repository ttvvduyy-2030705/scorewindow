import i18n from 'i18n';

const DURATION_LIST = [
  {
    title: () => i18n.t('txtMinuteOrder', {minute: 0}),
    value: 0,
  },
  {
    title: () => i18n.t('txtMinuteOrder', {minute: 5}),
    value: 5,
  },
  {
    title: () => i18n.t('txtMinuteOrder', {minute: 15}),
    value: 15,
  },
  {
    title: () => i18n.t('txtMinuteOrder', {minute: 30}),
    value: 30,
  },
  {
    title: () => i18n.t('txtMinuteOrder', {minute: 45}),
    value: 45,
  },
  {
    title: () => i18n.t('txtMinuteOrder', {minute: 60}),
    value: 60,
  },
  {
    title: () => i18n.t('txtFullGame'),
    value: -1,
  },
];

export {DURATION_LIST};

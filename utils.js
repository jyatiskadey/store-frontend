import num2words from 'num2words';

export const formatAmountInWords = (amount) => {
  const amountInt = Math.floor(amount);
  const words = num2words(amountInt, { lang: 'en' });
  return `${words.charAt(0).toUpperCase()}${words.slice(1)} rupees only.`;
};

import { useMediaQuery } from 'react-responsive';

export const useIsMobile = () => {
  // now only need judge width
  return useMediaQuery({ maxWidth: 768 });
};

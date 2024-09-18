export const throttle = (fb: Function, delay = 300) => {
  let timer = false;
  return () => {
    if (timer) return;
    fb();
    timer = true;
    setTimeout(() => {
      timer = false;
    }, delay);
  };
};

export const debounce = (func: (args: string) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (args: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(null, [args]);
    }, delay);
  };
};

const scrollTo = (element: HTMLElement, yOffset?: boolean) => {
  console.log('element', element);
  if (element) {
    console.log();
    const yo = yOffset ? -80 : -60;
    if (yOffset) {
      const mEl = document.getElementById('content');
      console.log('mEl', mEl);
      if (!mEl) return;
      const y = element.getBoundingClientRect().top;
      console.log(y);
      mEl.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      const y = element.getBoundingClientRect().top + window.scrollY + yo;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
};

export default scrollTo;

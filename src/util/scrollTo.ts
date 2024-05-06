const scrollTo = (element: HTMLElement, yOffset?: boolean) => {
  if (element) {
    const yo = yOffset ? -80 : -60;
    if (yOffset) {
      const mEl = document.getElementById('content');
      console.log(mEl);
      if (!mEl) return;
      const y = element.getBoundingClientRect().top + mEl.scrollTop + yo;
      mEl.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      const y = element.getBoundingClientRect().top + window.scrollY + yo;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
};

export default scrollTo;

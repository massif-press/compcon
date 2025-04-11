export const register = (Quill) => {
  // Register toolbar button inside the theme
  const icons = Quill.import('ui/icons');
  icons.horusText = `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 780.5 24 24" fill="#7f7f7f" >
<path d="M10.324,786.327c-2.063-0.548-4.024-1.431-5.804-2.615l-0.211-0.141c-0.4-0.267-0.822-0.487-1.258-0.66
  c-0.196-0.079-0.39,0.127-0.298,0.317c0.176,0.367,0.265,0.785,0.238,1.226c-0.074,1.238-1.074,2.248-2.314,2.333
  c-1.458,0.101-2.672-1.051-2.672-2.485c0-0.382,0.086-0.744,0.241-1.067c0.092-0.194-0.097-0.403-0.296-0.323
  c-0.436,0.173-0.857,0.394-1.257,0.66l-0.211,0.141c-1.779,1.185-3.741,2.067-5.804,2.615c-0.225,0.06-0.238,0.372-0.019,0.448
  c0.831,0.29,2.835,1.206,4.307,1.894c1.107,0.518,1.969,1.442,2.406,2.582c0.875,2.284,2.35,8.381,2.916,10.773
  c0.057,0.242,0.402,0.241,0.458-0.001c0.56-2.391,2.02-8.479,2.888-10.764c0.435-1.146,1.299-2.075,2.41-2.594
  c1.471-0.687,3.471-1.602,4.3-1.891C10.562,786.699,10.549,786.387,10.324,786.327z"/>
<path d="M-0.678,783.97c0,0.65,0.527,1.177,1.178,1.177s1.179-0.526,1.179-1.177c0-0.332-0.139-0.632-0.361-0.846
  c-0.212-0.204-0.5-0.33-0.817-0.33c-0.318,0-0.606,0.126-0.818,0.33C-0.54,783.338-0.678,783.638-0.678,783.97z"/>
</svg>`;

  const Theme = Quill.import('themes/snow');
  Theme.DEFAULTS.modules.toolbar.handlers['horusText'] = function () {
    const range = this.quill.getSelection();
    if (range) {
      const current = this.quill.getFormat(range);
      this.quill.format('horusText', !current.horusText);
    }
  };
};

export const options = {
  modules: {
    toolbar: {
      container: [
        [{ header: [] }],
        [{ font: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['horusText'],
        ['clean'],
      ],
      handlers: {
        horusText: function () {
          const range = this.quill.getSelection();
          if (range) {
            const format = this.quill.getFormat(range);
            this.quill.format('horusText', !format.horusText);
          }
        },
      },
    },
  },
  formats: ['bold', 'italic', 'underline', 'link', 'image', 'horusText'],
  theme: 'snow',
};

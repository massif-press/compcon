import Quill from 'quill';

// Define custom blot
const Inline = Quill.import('blots/inline');

class HorusTextBlot extends Inline {
  static create(value) {
    const node = super.create();
    node.classList.add('horus-text');
    return node;
  }

  static formats() {
    return true;
  }
}

HorusTextBlot.blotName = 'horusText';
HorusTextBlot.tagName = 'code';
HorusTextBlot.className = 'horus';

Quill.register(HorusTextBlot, true);

import annHtml from '../panes/ann.html?raw'
import cnnHtml from '../panes/cnn.html?raw'
import rnnHtml from '../panes/rnn.html?raw'
import ganHtml from '../panes/gan.html?raw'
import optHtml from '../panes/opt.html?raw'
import attHtml from '../panes/att.html?raw'

export const TABS = [
  { id: 'ann', label: 'Neural network', html: annHtml },
  { id: 'cnn', label: 'CNN', html: cnnHtml },
  { id: 'rnn', label: 'RNN & LSTM', html: rnnHtml },
  { id: 'gan', label: 'GAN', html: ganHtml },
  { id: 'opt', label: 'Optimizers', html: optHtml },
  { id: 'att', label: 'Transformer attention', html: attHtml },
]

'use babel'

import { CompositeDisposable } from 'atom'
export default {
  activate () {
    this.frame = document.createElement('iframe')
    this.frame.setAttribute('class', 'tsu-twitch-frame')

    const pane = document.getElementsByTagName('atom-text-editor')[0]
    pane.parentElement.insertAdjacentElement('afterbegin', this.frame)

    this.subs = new CompositeDisposable()
    this.subs.add(atom.workspace.onDidChangeActivePaneItem(() => this.show()))
    this.subs.add(atom.config.observe('tsu.id', id => this.update({ id })))
    this.subs.add(atom.config.observe('tsu.opacity', opacity => this.update({ opacity })))
  },

  show () {
    this.frame.style.display = 'block'
    // Atom adds `display: none;` whenever active pane changes
  },

  update ({ id, opacity }) {
    if (opacity !== undefined) this.frame.style.opacity = opacity / 100
    if (id !== undefined) this.frame.setAttribute('src', 'https://player.twitch.tv/?channel=' + id)
  },

  deactivate () {
    this.subs.dispose()
    this.frame.remove()
  }
}

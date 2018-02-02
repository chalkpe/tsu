'use babel'

import { CompositeDisposable } from 'atom'

const twitchPrefix = 'https://player.twitch.tv/?channel='
const keys = ['id', 'opacity', 'foregroundOpacity', 'playerBackground']

export default {
  activate () {
    this.frame = document.createElement('iframe')
    this.frame.setAttribute('class', 'tsu-twitch-frame')

    this.subs = new CompositeDisposable()
    this.subs.add(atom.workspace.onDidChangeActivePaneItem(() => this.show()))
    this.subs.add(...keys.map(k => atom.config.observe(`tsu.${k}`, v => this.update(k, v))))
    this.subs.add(atom.commands.add('atom-workspace', { 'tsu:toggle': () => this.toggle() }))

    this.show()
  },

  inBackground () {
    return this.frame.style.zIndex !== '2'
  },

  toggle () {
    this.frame.style.zIndex = this.inBackground() ? '2' : '0'
    this.show()
  },

  update (key, value) {
    if (key === 'opacity') this.opacity = value
    if (key === 'foregroundOpacity') this.fOpacity = value
    if (key === 'playerBackground') this.playerBackground = value
    if (key === 'id') this.frame.setAttribute('src', twitchPrefix + value)

    this.show()
  },

  getPane () {
    const editor = document.getElementsByTagName('atom-text-editor')[0]
    return editor && editor.parentElement // atome-pane.pane > div.item-views
  },

  getPlayer () {
    const content = this.frame.contentDocument
    return content && content.getElementsByClassName('player')[0]
  },

  show () {
    const pane = this.getPane()
    const player = this.getPlayer()
    const opacity = this.inBackground() ? this.opacity : this.fOpacity

    this.frame.style.display = 'block'
    this.frame.style.opacity = opacity / 100

    if (player) player.style.background = this.playerBackground
    if(pane) pane.insertAdjacentElement('afterbegin', this.frame)
  },

  deactivate () {
    this.subs.dispose()
    this.frame.remove()
  }
}

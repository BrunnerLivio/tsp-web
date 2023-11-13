// @ts-check
import { LitElement, css, html } from "lit";
import { api } from "../api.js";

class SocketDropdown extends LitElement {
  constructor() {
    super();
    /** @type {import("../api.js").Socket[]} */
    this.sockets = [];

  }

  static styles = css`
    :host {
      position: relative;
    }
  `;

  static get properties() {
    return {
      sockets: { type: Array },
      currentSocket: { type: Object }
    }
  }

  /**
   * @param {import("@shoelace-style/shoelace").SlSelectEvent} event 
   */
  setSocket(event) {
    api.taskSpooler.setSocket(event.detail.item.value);
    this.currentSocket = this.sockets.find((socket) => socket.Path === event.detail.item.value);
    window.dispatchEvent(new CustomEvent('task-list-updated'));
  }

  render() {
    return html`
      <sl-dropdown>
        <sl-button slot="trigger" caret>${this.currentSocket ? `Socket: ${this.currentSocket.Name}` : `Socket: ${this.sockets[0].Name}`}</sl-button>
        <sl-menu @sl-select=${(e) => this.setSocket(e)}>
          ${this.sockets.map((socket) => {
      return html`<sl-menu-item value=${socket.Path}>${socket.Name}</sl-menu-item>`
    })}
        </sl-menu>
      </sl-dropdown>
    `;
  }
}

customElements.define('socket-dropdown', SocketDropdown);
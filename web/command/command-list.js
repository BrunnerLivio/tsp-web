// @ts-check
import { LitElement, html, css, nothing } from 'lit';
import { api } from '../api.js';

export class CommandList extends LitElement {
  constructor() {
    super();
    /** @type {import('../api.js').Command[]} */
    this.commands = [];
    this.isLoading = true;
  }

  static get properties() {
    return {
      commands: { type: Array },
      isLoading: { type: Boolean },
    }
  }

  static styles = css`
    :host .container {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: var(--sl-spacing-medium);
    }
  `;


  #exec(command) {
    api.taskSpooler.exec(command.Name)
      .then(() => window.dispatchEvent(new CustomEvent('task-list-updated')));
  }


  render() {
    if (this.isLoading) {
      return nothing;
    }
    return html`
      <div class="container">
      ${this.commands.map((command) => {
      return html`
          <sl-button @click=${() => this.#exec(command)} variant="default" size="large">
            <sl-icon slot="prefix" name="play-circle"></sl-icon>
            Start ${command.Name}
          </sl-button>`
    })}
      </div>
    `;
  }
}
customElements.define('command-list', CommandList);

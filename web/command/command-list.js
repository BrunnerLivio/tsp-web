// @ts-check
import { LitElement, html, css } from 'lit';



export class CommandList extends LitElement {
  constructor() {
    super();
    this.commands = [];
  }

  static get properties() {
    return {
      commands: { type: Array, attribute: false }
    }
  }

  async #loadCommands() {
    this.commands = await fetch('/api/v1/command')
      .then(response => response.json())
  }

  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.#loadCommands();
  }

  #exec(command) {
    fetch(`/api/v1/task-spooler/exec`, {
      method: 'POST', body: JSON.stringify({ Name: command.Name })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      });
  }


  render() {
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

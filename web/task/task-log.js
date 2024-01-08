// @ts-check
import { LitElement, html, css } from 'lit';
import { connect } from '../ws.js';

export class TaskLog extends LitElement {
  constructor() {
    super();
    /** @type {import('../api.js').Task | null} */
    this.task = null;
    /** @type {WebSocket | null} */
    this.conn = null
    this.log = '';
    this.fileName = '';
  }

  static get properties() {
    return {
      task: { type: Object },
      isOpen: { type: Boolean },
      log: { type: String, attribute: false },
      fileName: { type: String }
    };
  }

  static styles = css`
    :host {
      display: block;
      border-radius: var(--sl-border-radius-large);
      overflow: hidden;
      margin-top: var(--sl-spacing-medium);
    }

    :host code {
      font-family: var(--sl-font-mono);
      font-size: 14px;
      background-color: #1e1e1e;
      display: block;
      padding: var(--sl-spacing-medium);
      max-height: 50vh;
      overflow-y: auto;
    }

    :host code pre {
      margin: 0;
      padding: 0;
    }

    :host .filename {
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      color: #f4f0ff;
      background-color: #1e1e1e;
      font-family: var(--sl-font-mono);
      box-shadow: var(--sl-shadow-large);
      padding: var(--sl-spacing-medium);
    }
  `;

  async firstUpdated() {
    if (this.task?.State === 'queued') {
      return;
    }

    const { conn, startFilestream } = await connect();

    this.conn = conn;
    startFilestream(this.task);
    conn.onmessage = (event) => {
      this.log = event.data;
      this.handleNewLog();
    }
  }

  handleNewLog() {
    const logContainer = this.shadowRoot?.querySelector('.logs');

    if (!logContainer) {
      return
    }

    const isScrolledToBottom = logContainer.scrollTop + logContainer.clientHeight >=
      logContainer.scrollHeight;

    if (isScrolledToBottom) {
      window.requestAnimationFrame(() => {
        logContainer.scrollTop = logContainer.scrollHeight;
      });
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.conn) {
      this.conn.close();
    }
  }


  render() {
    return html`
      <div class="filename">${this.fileName}</div>
      <code class="logs">
        <pre>${this.log !== '' ? this.log : 'No logs'}</pre>
      </code>
    `;
  }
}

customElements.define('task-log', TaskLog);

import { LitElement, css, html } from 'lit';

export class Card extends LitElement {
  constructor() {
    super();
    this.title = '';
  }

  static styles = css`
    :host .card {
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      background: radial-gradient(57.89% 132% at 65.79% -35%,rgba(120,123,255,.06) 0%,rgba(120,123,255,0) 100%),linear-gradient(180deg,rgba(255,255,255,0) 54.17%,rgba(255,255,255,.04) 100%),rgba(255,255,255,.01);
      border-radius: 16px;
      padding: 24px 28px;
    }

    :host .card:before {
      background: linear-gradient(180deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,0) 100%),linear-gradient(0deg,rgba(255,255,255,.04),rgba(255,255,255,.04));
      border-radius: inherit;
      content: "";
      inset: 0;
      -webkit-mask: linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
      mask: linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
      mask-composite: xor;
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 1px;
      pointer-events: none;
      position: absolute;
    }


    :host h2, :host slot[name="title"]::slotted(*) {
      margin: 0 0 var(--sl-spacing-large) 0;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: #f4f0ff;
    }
    `

  static get properties() {
    return {
      title: { type: String, attribute: true },
    }
  }

  render() {
    return html`
      <div class="card">
        ${this.title ? html`<h2>${this.title}</h2>` : html`<slot name="title"></slot>`}
        <slot></slot>
      </div>
    `;
  }
}
customElements.define('app-card', Card);

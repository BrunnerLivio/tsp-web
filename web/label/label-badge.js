// @ts-check
import { LitElement, html, css } from "lit";
import './label.js';

export class LabelBadge extends LitElement {
  constructor() {
    super();
    /** @type {Label | null} */
    this.label = null;
    this.clickable = false;
  }

  static get styles() {
    return css`
      :host {
        display: inline-flex;
        box-sizing: border-box;
      }

      :host .clickable {
        cursor: pointer;
      }

      :host .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: max(12px, 0.75em);
        font-weight: var(--sl-font-weight-semibold);
        letter-spacing: var(--sl-letter-spacing-normal);
        line-height: 1;
        border-radius: var(--sl-border-radius-small);
        border: solid 1px var(--sl-color-neutral-0);
        white-space: nowrap;
        padding: 0.35em 0.6em;
        user-select: none;
        cursor: inherit;
        border-radius: var(--sl-border-radius-pill);
        color: white;
      }
    `;
  }

  static get properties() {
    return {
      label: { type: Object },
      clickable: { type: Boolean }
    }
  }

  render() {
    return html`
      <span class="badge" style="background: ${this.label?.BgColor}">${this.label?.Icon} ${this.label?.Name}</span>
    `;
  }
}

customElements.define('label-badge', LabelBadge);
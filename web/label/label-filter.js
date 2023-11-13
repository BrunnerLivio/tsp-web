// @ts-check
import { LitElement, html, css, nothing } from "lit";

/**
 * @typedef {CustomEvent<{ label: string }>} FilterChangedEvent
 */

export class LabelFilter extends LitElement {

  constructor() {
    super();
    /** @type {import('../api.js').Label[]} */
    this.labels = [];
    this.isLoading = true;
  }

  static styles = css`
    :host .container {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: var(--sl-spacing-small);
      padding: var(--sl-spacing-medium) 0;
    }
  `;

  static get properties() {
    return {
      labels: { type: Array },
      isLoading: { type: Boolean }
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', () => {
      const queryParams = new URLSearchParams(window.location.search);
      const label = queryParams.get('label');
      if (label && this.labels.find((l) => l.Name === label) !== null) {
        this.dispatchEvent(new CustomEvent('filter-changed', {
          detail: { label }
        }));
      }
    });
  }

  /**
   * @param {string} label
   */
  #updateUrlLabel(label) {
    // @ts-ignore
    const url = new URL(window.location);
    url.searchParams.set('label', label);
    window.history.pushState(null, '', url.toString());
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  render() {
    if (this.isLoading) {
      return nothing;
    }

    return html`
      <div class="container">
        <a href="#" @click="${() => this.#updateUrlLabel('all')}">
          <label-badge name="All" bgColor="var(--sl-color-primary-500)"></label-badge>
        </a>

        ${this.labels.map((label) => html`
          <a href="#" @click="${() => this.#updateUrlLabel(label.Name)}">
            <label-badge .name=${label.Name} .icon=${label.Icon} .bgColor=${label.BgColor} .fgColor=${label.FgColor}></label-badge>
          </a>
        `)}
      </div>
    `;
  }
}

customElements.define('label-filter', LabelFilter);

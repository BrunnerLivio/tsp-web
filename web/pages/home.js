// @ts-check
import { LitElement, html, css } from "lit";
import '../task/task-list.js'
import '../task/task-item.js'
import '../label/label-badge.js'
import '../label/label-filter.js'
import '../label/label.js'
import '../command/command-list.js'
import '../card.js'

export class Home extends LitElement {
  constructor() {
    super();
    /** @type {Task[]} */
    this.tasks = [];
    /** @type {Task[]} */
    this.filteredTasks = [];
    /** @type {Label[]} */
    this.labels = [];
    this.isLoadingTasks = true;
    this.isLoadingLabels = true;
    /**
     * @type {{ label: string }}
     */
    this.filter = { label: 'all' };
  }

  static styles = css`
    :host .container {
      padding: var(--sl-spacing-small);
      display: flex;
      flex-direction: column;
      gap: var(--sl-spacing-large);
    }

    @media (min-width: 768px) {
      :host .container {
        padding: var(--sl-spacing-2x-large);
      }
    }
  `;

  static get properties() {
    return {
      tasks: { type: Array, attribute: false },
      filteredTasks: { type: Array, attribute: false },
      filter: { type: Object, attribute: false },
      labels: { type: Array, attribute: false },
      isLoadingTasks: { type: Boolean, attribute: false },
      isLoadingLabels: { type: Boolean, attribute: false }
    }
  }

  async #loadTasks() {
    this.tasks = await fetch('/api/v1/task-spooler/list')
      .then(response => response.json())
    this.#filterTasks();
    this.isLoadingTasks = false;
  }

  async #loadLabels() {
    this.labels = await fetch('/api/v1/label')
      .then(response => response.json())
    this.isLoadingLabels = false;
  }

  #filterTasks() {
    if (this.filter.label && this.filter.label !== 'all') {
      this.filteredTasks = this.tasks.filter((task) => {
        return task.Label?.Name === this.filter.label
      })
    } else {
      this.filteredTasks = this.tasks;
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    setInterval(async () => {
      await this.#loadTasks()
    }, 1000);
    await Promise.all([this.#loadTasks(), this.#loadLabels()])
  }

  /**
   * @param {import("../label/label-filter.js").FilterChangedEvent} e
   */
  #updateFilter = (e) => {
    this.filter.label = e.detail.label;
    this.#filterTasks();
  }


  render() {
    return html`
      <div class="container">
        <app-card title="Commands">
          <command-list></command-list>
        </app-card>
        <app-card title="Tasks">
          <label-filter @filter-changed="${this.#updateFilter}" .labels=${this.labels} .isLoading=${this.isLoadingLabels}></label-filter>
          <task-list @task-list-updated="${this.#loadTasks}" .tasks=${this.filteredTasks} .isLoading=${this.isLoadingTasks}></task-list>
        </app-card>
      </div>
    `;
  }
}

customElements.define('app-home', Home);
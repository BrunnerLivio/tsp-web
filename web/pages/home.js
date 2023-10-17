// @ts-check
import { LitElement, html, css, nothing } from "lit";
import '../task/task-list.js'
import '../task/task-item.js'
import '../label/label-badge.js'
import '../label/label-filter.js'
import '../command/command-list.js'
import '../card.js'
import { api } from "../api.js";

export class Home extends LitElement {
  constructor() {
    super();
    /** @type {import("../api.js").Task[]} */
    this.tasks = [];
    /** @type {import("../api.js").Task[]} */
    this.filteredTasks = [];
    /** @type {Partial<import("../api.js").Config>} */
    this.config = {};
    this.isLoadingTasks = true;
    this.isLoadingConfig = true;
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
    this.tasks = await api.taskSpooler.list();
    this.#filterTasks();
    this.isLoadingTasks = false;
  }

  async #loadConfig() {
    this.config = await api.config.get();
    this.isLoadingConfig = false;
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
      window.dispatchEvent(new CustomEvent('task-list-updated'));
    }, 2000);
    window.addEventListener('task-list-updated', async () => await this.#loadTasks())
    await Promise.all([this.#loadTasks(), this.#loadConfig()])
  }

  /**
   * @param {import("../label/label-filter.js").FilterChangedEvent} e
   */
  #updateFilter = (e) => {
    this.filter.label = e.detail.label;
    this.#filterTasks();
  }


  render() {
    const hasCommands = (this.config.Commands || []).length > 0;

    const commandsCard = html`
    <app-card title="Commands">
      <command-list .commands=${this.config.Commands || []} .isLoading=${this.isLoadingConfig}></command-list>
    </app-card>
    `

    return html`
      <div class="container">
        ${hasCommands ? commandsCard : nothing}
        <app-card title="Tasks">
          <label-filter @filter-changed="${this.#updateFilter}" .labels=${this.config.Labels || []} .isLoading=${this.isLoadingConfig}></label-filter>
          <task-list @task-list-updated="${this.#loadTasks}" .tasks=${this.filteredTasks} .isLoading=${this.isLoadingTasks}></task-list>
        </app-card>
      </div>
    `;
  }
}

customElements.define('app-home', Home);
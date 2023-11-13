// @ts-check
import { LitElement, css, html } from 'lit';
import { repeat } from "lit-html/directives/repeat.js";

export class TaskList extends LitElement {
  constructor() {
    super();
    /** @type {import('../api.js').Task[]} */
    this.tasks = [];
    this.isLoading = true;
  }

  static styles = css`
    :host sl-skeleton {
      height: 3.75rem;
      --border-radius: var(--sl-border-radius-small);
    }

    :host .task-list {
      display: flex;
      flex-direction: column;
      gap: var(--sl-spacing-x-small);
    }

    :host .task-list-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--sl-spacing-medium);
    }

    :host .task-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    :host .task-list-title {
      font-size: 16px;
      font-weight: 500;
      color: #f4f0ff;
    }
  `;

  static get properties() {
    return {
      tasks: { type: Array },
      isLoading: { type: Boolean }
    }
  }

  async #clearCompleted() {
    await fetch('/api/v1/task-spooler/clear', {
      method: 'POST'
    });
    window.dispatchEvent(new CustomEvent('task-list-updated'));
  }

  render() {
    if (this.isLoading) {
      return html`
        <div class="task-list">
          ${[...Array(5).keys()].map(() => html`
            <sl-skeleton></sl-skeleton>
          `)}
        </div>
      `;
    }

    const scheduledTasks = this.tasks.filter((task) => task.State === 'running' || task.State === 'queued');
    const completedTasks = this.tasks.filter((task) => task.State === 'finished');

    return html`
      <div class="task-list-wrapper">
        <section class="task-list task-list-scheduled">
          <header class="task-list-header">
            <span class="task-list-title">Scheduled</span>
          </header>
          ${scheduledTasks.length > 0 ? repeat(scheduledTasks, task => task.ID, (task) => html`
            <task-item .task=${task}></task-item>
          `) :
        'No scheduled tasks'}
        </section>
        <section class="task-list task-list-completed">
          <header class="task-list-header">
            <span class="task-list-title">Completed</span>
            <sl-button @click=${this.#clearCompleted}>
              <sl-icon slot="prefix" name="trash"></sl-icon>
              Clear 
            </sl-button>
          </header>
        ${completedTasks.length > 0 ? repeat(completedTasks, task => task.ID, (task) => html`
            <task-item .task=${task}></task-item>
        `) :
        'No completed tasks'}
        </section >
      </div >
      `;
  }
}

customElements.define('task-list', TaskList);

// @ts-check
import { LitElement, css, html, nothing } from 'lit';
import './task.js';

export class TaskList extends LitElement {
  constructor() {
    super();
    /** @type {Task[]} */
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
    this.dispatchEvent(new CustomEvent('task-list-updated'));
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
          ${scheduledTasks.length > 0 ? scheduledTasks.map((task) => html`
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
        ${completedTasks.length > 0 ? completedTasks.map((task) => html`
            <task-item .task=${task}></task-item>
        `) :
        'No completed tasks'}
        </section >
      </div >
      `;
  }
}

customElements.define('task-list', TaskList);


// if (window["WebSocket"]) {
//   const conn = new WebSocket("ws://" + document.location.host + "/ws");
//   console.log('connecting')
//   conn.onopen = () => {
//     console.log('Connected')
//     conn.send('asdf')
//   }
//   conn.onclose = function (evt) {
//     console.log('Closed')
//   };
//   conn.onmessage = function (evt) {
//     console.log('Message')
//   };
// } 
// @ts-check
import { LitElement, css, html, nothing } from "lit";
import { intervalToDuration } from "date-fns";
import { formatDuration } from "../utils.js";
import './task-log.js'
import { api } from "../api.js";

export class TaskItem extends LitElement {
  static styles = css`
    :host {
      width: 100%;
    }

    :host .task-item-summary {
      display: flex;
      gap: var(--sl-spacing-medium);
      align-items: center;
      width: 100%;
      padding-right: var(--sl-spacing-medium);
    }

    :host .task-item.error {
      --sl-color-neutral-200: var(--sl-color-danger-500);
      --sl-color-neutral-0: var(--sl-color-danger-50);
    }

    :host .task-item.error sl-icon {
      color: var(--sl-color-danger-500);
    }

    :host .task-item.success {
      --sl-color-neutral-200: var(--sl-color-success-500);
      --sl-color-neutral-0: var(--sl-color-success-50);
    }

    :host .task-item.success sl-icon {
      color: var(--sl-color-success-500);
    }

    :host .task-item.running {
      --sl-color-neutral-200: var(--sl-color-primary-500);
      --sl-color-neutral-0: var(--sl-color-primary-100);
    }

    :host .task-item.running sl-icon {
      color: var(--sl-color-primary-500);
    }

    :host .task-item.queued {
      --sl-color-neutral-200: var(--sl-color-warning-500);
      --sl-color-neutral-0: var(--sl-color-warning-50);
    }

    :host .task-item.queued sl-icon {
      color: var(--sl-color-warning-500);
    }

    :host .task-item-details {
      display: flex;
      flex-direction: column;
      gap: var(--sl-spacing-small);
    }

    :host .task-item-details-row {
      display: flex;
    }

    :host .task-item-details-label {
      font-weight: var(--sl-font-weight-semibold);
      width: 100px;
    }

    :host .task-item-id {
      opacity: 0.5;
      display: none;
    }

    @media (min-width: 768px) {
      :host .task-item-id {
        display: block;
      }

      :host .task-item-details {
        padding: var(--sl-spacing-medium);
      }
    }

    :host .spacer {
      flex: 1;
    }
  `;

  constructor() {
    super();
    /** @type {import("../api.js").Task | null} */
    this.task = null;
    this.isOpen = false;
  }

  /**
   * @param {Event} e 
   */
  #kill(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!this.task) {
      return
    }

    if (!confirm(`Are you sure you want to kill task #${this.task.ID}?`)) {
      return
    }

    api.taskSpooler.kill(this.task.ID)
      .then(() => window.dispatchEvent(new CustomEvent('task-list-updated')));
  }

  static get properties() {
    return {
      task: { type: Object },
      isOpen: { type: Boolean }
    };
  }

  get state() {
    if (this.task === null) {
      return ''
    }

    if (this.task.State === 'running') {
      return 'running'
    }

    if (this.task.State === 'queued') {
      return 'queued'
    }

    if (this.task.State === 'finished') {
      if (this.task.ELevel !== '0') {
        return 'error'
      }
      return 'success'
    }

    return 'unknown'
  }

  get icon() {
    switch (this.state) {
      case 'running':
        return 'hourglass-split'
      case 'queued':
        return 'three-dots'
      case 'success':
        return 'check-circle'
      case 'error':
        return 'exclamation-circle'
      default:
        return ''
    }
  }

  get timeRun() {
    if (this.task === null || this.task?.Detail === null) {
      return null
    }

    if (this.task.State === 'queued') {
      return null
    }

    if (this.task.State === 'running') {
      const secondsTillNow = Math.floor((new Date().getTime() - new Date(this.task.Detail.StartTime).getTime()) / 1000)

      const duration = intervalToDuration({
        start: 0,
        end: secondsTillNow * 1000
      })

      return formatDuration(duration)
    }

    const seconds = Math.floor(parseInt(this.task.Detail.TimeRun.replace('s', '')))

    const duration = intervalToDuration({
      start: 0,
      end: seconds * 1000
    })

    return formatDuration(duration)
  }

  render() {
    if (!this.task) {
      return nothing;
    }

    /** @type {import('lit').TemplateResult<1> | typeof import('lit').nothing} */
    let label = nothing;
    if (this.task.Label) {
      label = html`<label-badge
        .icon=${this.task.Label.Icon}
        .bgColor=${this.task.Label.BgColor}
        .fgColor=${this.task.Label.FgColor}
        .name=${this.task.Label.Name}
      ></label-badge>`;
    } else if (this.task.LabelName) {
      label = html`<label-badge .name=${this.task.LabelName}></label-badge>`;
    }

    return html`
      <sl-details
        class=${`task-item ${this.state}`}
        id=${`task-${this.task.ID}`}
        @sl-show=${() => (this.isOpen = true)}
        @sl-hide=${() => (this.isOpen = false)}
      >
        <div slot="summary" class="task-item-summary">
          <sl-icon name=${this.icon}></sl-icon>
          <span class="task-item-id">#${this.task.ID}</span>
          <strong>${this.task.Command}</strong>
          ${label}
          <div class="spacer"></div>
          ${this.timeRun !== null ? html`<span>${this.timeRun}</span>` : nothing}
          ${this.state === 'running' ? html`<sl-icon-button name="stop-circle" label="Kill" @click=${this.#kill}></sl-icon-button>` : nothing}
        </div>
        
        <div class="task-item-details">
          <div class="task-item-details-row">
            <span class="task-item-details-label">State</span>
            <span class="task-item-details-value">${this.task.State}</span>
          </div>
          <div class="task-item-details-row">
            <span class="task-item-details-label">Times</span>
            <span class="task-item-details-value">${this.task.Times}</span>
          </div>
          <div class="task-item-details-row">
            <span class="task-item-details-label">Exit Level</span>
            <span class="task-item-details-value">${this.task.ELevel}</span>
          </div>
          ${this.isOpen ? html`<task-log .task=${this.task} .fileName=${this.task.Output}></task-log>` : nothing}
        </div>
      </sl-details>
    `
  }
}

customElements.define("task-item", TaskItem);
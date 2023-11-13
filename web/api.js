// @ts-check
/**
 * @typedef {object} Label
 * @property {string} Name
 * @property {string} BgColor
 * @property {string} FgColor
 * @property {string} Icon
 */
/**
 * @typedef {object} Command
 * @property {string} Name
 * @property {string} Args
 */
/**
 * @typedef {object} Socket
 * @property {string} Name
 * @property {string} Path
 */
/**
 * @typedef {object} Config
 * @property {Label[]} Labels
 * @property {Command[]} Commands
 * @property {Socket[]} Sockets
 */

/**
 * @typedef {'running' | 'queued' | 'finished'} TaskState
 */
/**
 * @typedef {object} TaskDetail
 * @property {string} ExitStatus
 * @property {string} Command
 * @property {number} SlotsRequired
 * @property {string} EnqueueTime
 * @property {string} StartTime
 * @property {string} EndTime
 * @property {string} TimeRun
 */
/**
 * @typedef {object} Task
 * @property {string} ID
 * @property {TaskState} State
 * @property {string} Output
 * @property {string} ELevel
 * @property {string} Times
 * @property {string} Command
 * @property {Label} Label
 * @property {string} LabelName
 * @property {TaskDetail?} Detail
 */

const taskSpooler = {
  /**
   * @type {string}
   */
  socket: 'default',

  /**
   * @param {string} socket 
   */
  setSocket: (socket) => {
    taskSpooler.socket = socket
  },

  /**
   * @param {string} id 
   */
  kill: async (id) => {
    const query = new URLSearchParams({ socket: taskSpooler.socket })
    await fetch(`/api/v1/task-spooler/kill/${id}?${query}`, { method: 'POST' })
  },

  /**
   * 
   * @returns {Promise<Task[]>}
   */
  list: async () => {
    const query = new URLSearchParams({ socket: taskSpooler.socket })
    return await fetch(`/api/v1/task-spooler/list?${query}`)
      .then(response => response.json())
  },

  /**
   * @param {string} name
   * @returns {Promise<Task>}
   */
  exec: async (name) => {
    const query = new URLSearchParams({ socket: taskSpooler.socket })
    return await fetch(`/api/v1/task-spooler/exec?${query}`, {
      method: 'POST', body: JSON.stringify({ Name: name })
    })
      .then(response => response.json())
  }
}

const config = {
  /**
   * @returns {Promise<Config>}
   */
  get: async () => {
    return await fetch('/api/v1/config').then(response => response.json())
  }
}

export const api = {
  taskSpooler,
  config,
}

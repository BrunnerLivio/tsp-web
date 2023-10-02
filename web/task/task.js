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
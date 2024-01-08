// @ts-check

export function connect() {
  return new Promise((resolve, reject) => {
    if (!window["WebSocket"]) {
      reject('Browser does not support WebSockets')
    }
    const conn = new WebSocket("ws://" + document.location.host + "/ws");

    /**
     * @param {import("./api").Task} task
     */
    function startFilestream(task) {
      conn.send(`start-filestream:${task.Output}`)
    }

    /**
     * @param {import("./api").Task} task
     */
    function stopFilestream(task) {
      conn.send(`stop-filestream:${task.Output}`)
    }

    conn.onopen = () => {
      resolve({ conn, startFilestream })
    }
  })
}

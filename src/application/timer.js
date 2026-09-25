/**
 * Timer used by an exercise session.
 *
 * Dependencies are injected so the timing logic can be tested without a DOM
 * or real wall-clock delays.
 *
 * @param {object} options
 * @param {(milliseconds: number) => string} options.formatTime
 * @param {() => void} options.onTimeUp
 * @param {() => number} [options.now]
 * @param {typeof setInterval} [options.schedule]
 * @param {typeof clearInterval} [options.cancel]
 * @return {{startCountdown: Function, startCountUp: Function, stop: Function}}
 */
export function createSessionTimer({
  formatTime,
  onTimeUp,
  now = () => Date.now(),
  schedule = setInterval,
  cancel = clearInterval,
}) {
  let intervalId = null;

  function stop() {
    if (intervalId !== null) {
      cancel(intervalId);
      intervalId = null;
    }
  }

  function startCountdown(clock, milliseconds) {
    stop();
    const end = now() + milliseconds;

    const tick = () => {
      const remaining = end - now();
      clock.innerHTML = formatTime(remaining);
      if (remaining <= 0) {
        stop();
        onTimeUp();
      }
    };

    intervalId = schedule(tick, 500);
  }

  function startCountUp(clock) {
    stop();
    const start = now();

    const tick = () => {
      clock.innerHTML = formatTime(now() - start);
    };

    intervalId = schedule(tick, 500);
  }

  return {
    startCountdown,
    startCountUp,
    stop,
  };
}

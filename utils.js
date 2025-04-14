const { trace, context } = require('@opentelemetry/api');
const logger = require('./logger');

const tracer = trace.getTracer('utils-func');

async function simulateDBCall() {
  return tracer.startActiveSpan('DBCall', (span) => {
    let current_span = trace.getSpan(context.active());
    let trace_id = current_span.spanContext().traceId;
    let span_id = current_span.spanContext().spanId;

    return new Promise((resolve) => {
      setTimeout(() =>{
        logger.info({
          message: `Successful DB call`,
          labels:{
            trace_id,
            span_id,
          }
        });
        span.end();
        resolve();
      }, Math.random() * 500 + 100);
    });
  });
}

async function simulateExternalAPI() {
  return tracer.startActiveSpan('ExternalAPICall', (span) => {
    let current_span = trace.getSpan(context.active());
    let trace_id = current_span.spanContext().traceId;
    let span_id = current_span.spanContext().spanId;
    return new Promise((resolve) => {
      setTimeout(() => {
        logger.info({
          message: `Successful ExternalAPI call`,
          labels:{
            trace_id,
            span_id,
          }
        });
        span.end();
        resolve();
      }, Math.random() * 200 + 50);
    });
  });
}

module.exports = { simulateDBCall, simulateExternalAPI };

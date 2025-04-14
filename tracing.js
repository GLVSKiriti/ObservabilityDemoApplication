/*instrumentation.js*/
const { NodeSDK } = require('@opentelemetry/sdk-node');
const {PeriodicExportingMetricReader} = require('@opentelemetry/sdk-metrics');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const {OTLPTraceExporter} = require('@opentelemetry/exporter-trace-otlp-proto');
const {OTLPMetricExporter} = require('@opentelemetry/exporter-metrics-otlp-proto');
const {ATTR_SERVICE_NAME,ATTR_SERVICE_VERSION,} = require('@opentelemetry/semantic-conventions');

const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'api-server',
    [ATTR_SERVICE_VERSION]: '0.1.0',
  }),
  // traceExporter: new ConsoleSpanExporter(),
  traceExporter: new OTLPTraceExporter(),
  metricReader: new PeriodicExportingMetricReader({
    // exporter: new ConsoleMetricExporter(),
    exporter: new OTLPMetricExporter(),
  }),
});

sdk.start();


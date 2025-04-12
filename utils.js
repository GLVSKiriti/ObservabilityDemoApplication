async function simulateDBCall() {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 200 + 50);
  });
}

async function simulateExternalAPI() {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 500 + 100);
  });
}

module.exports = { simulateDBCall, simulateExternalAPI };

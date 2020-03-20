const exchange = document.querySelector("#exchange");

if (exchange) {
  exchange.addEventListener("submit", async function(event) {
    event.preventDefault();
    let from = event.target.from.value;
    let to = event.target.to.value;
    let sum = event.target.sum.value;
    let response = await fetch(event.target.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify({
        from: from,
        to: to,
        sum: sum
      })
    });
    let result = await response.json();
    let allSum = +result * +sum;
    document.querySelector(
      ".exchange"
    ).innerHTML = `<p>Обменный курс: ${result}</p><p>${sum} ${from} это ${allSum} ${to}</p>`;
  });
}

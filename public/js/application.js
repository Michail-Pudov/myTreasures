document
  .querySelector("#exchange")
  .addEventListener("submit", async function(event) {
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
    document.querySelector(
      ".exchange"
    ).innerHTML = `<p>Обменный курс: ${result}</p>`;
  });

// document.querySelector("#QR").addEventListener("submit", async function(event) {
//   event.preventDefault();
//   const str = event.target.qrString.value;
//   const newString = str
//     .replace("i=", "fd=")
//     .replace(/t=(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/, "$3.$2.$1+$4%3A$5&qr=0");

//   let response = await fetch("https://proverkacheka.com/check/get", {
//     credentials: "omit",
//     headers: {
//       accept: "application/json, text/javascript, */*; q=0.01",
//       "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
//       "sec-fetch-dest": "empty",
//       "x-requested-with": "XMLHttpRequest"
//     },
//     referrer: "https://proverkacheka.com/",
//     referrerPolicy: "no-referrer-when-downgrade",
//     body:
//       "fn=9281000100320287&fd=143470&fp=1935815010&n=1&s=145.51&t=16.03.2020+16%3A48&qr=0",
//     method: "POST",
//     mode: "cors"
//   });
//   // let response = await fetch("https://proverkacheka.com/check/get", {
//   //   credentials: "omit",
//   //   headers: {
//   //     accept: "application/json, text/javascript, */*; q=0.01",
//   //     "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
//   //     "sec-fetch-dest": "empty",
//   //     "x-requested-with": "XMLHttpRequest"
//   //   },
//   //   referrer: "https://proverkacheka.com/",
//   //   referrerPolicy: "no-referrer-when-downgrade",
//   //   body: newString,
//   //   method: "POST",
//   //   mode: "cors"
//   // });
//   let result = await response.json();
//   console.log(result.data.json.items);
// });

const puppeteer = require('puppeteer');
const mailgun = require('mailgun-js');
const url = 'https://www.target.com.au/p/pre-lit-snowy-aspen-christmas-tree-7ft-t14/62544573';
const DOMAIN = "sandbox1f0e82e3c6a04e3b828f0b6e933615d6.mailgun.org";
const mg = mailgun({apiKey: "a67a9b62073122f5423317e04dd01413-1df6ec32-b22d7d69", domain: DOMAIN});
const data = {
  from: "Mailgun Sandbox <postmaster@sandbox1f0e82e3c6a04e3b828f0b6e933615d6.mailgun.org>",
  to: "kyle.xje@gmail.com",
  subject: "GO!! T14 is available!",
  text: "GO GO GO! T14 is available online! https://www.target.com.au/p/pre-lit-snowy-aspen-christmas-tree-7ft-t14/62544573"
};

const runJob = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 920 });
  await page.goto(url);

  // console.log('went to url: ', url);

  await page.screenshot({path: `screenshot-${new Date().toISOString()}.png`});

  const content = await page.content();
  const matches = content.match('<p class="ProductCartPill-unavailableMessage ProductCartPill-unavailableMessage--endOfLife">This product is sold out online and in store</p>');
  await browser.close();


  const currentPrice = matches[0];
  console.log('current price: ', currentPrice);
  if (!matches) {
    mg.messages().send(data, function (error, body) {
      console.log(body);
    });
  }
};

const scheduler = () => {
  runJob();
  setTimeout(scheduler, 5 * 60 * 1000);
};

scheduler();

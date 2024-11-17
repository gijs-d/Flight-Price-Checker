
const options = {
  stay: 30,
  show: 5,
};
const citys = data[2];
const url = (day) => `https://www.bing.com/travel/flight-search?src=${citys.from}&des=${citys.to}&ddate=${day}`;
const url2 = (day) => `https://www.bing.com/travel/flight-search?src=${citys.to}&des=${citys.from}&ddate=${day}`;
let reverse = false;

document.addEventListener('DOMContentLoaded', init);

function init() {
  document.querySelector('#from').innerText = `${citys.from} ->`;
  document.querySelector('#to').innerText = citys.to;
  document.querySelector('#rev').checked = reverse;
  document.querySelector('#show').addEventListener('input', (e) => options.show = Number(e.target.value));
  document.querySelector('#stay').addEventListener('input', (e) => options.stay = Number(e.target.value));
  document.querySelector('#rev').addEventListener('change', reverseList);
  printTable();
}

function reverseList() {
  reverse = !reverse;
  printTable();
}

function makeDay(today) {
  const d = (((today)).getDate());
  const m = (((today)).getMonth() + 1);
  const y = (((today)).getFullYear());
  return `${y}-${m >= 10 ? m : '0' + '' + m}-${d >= 10 ? d : '0' + '' + d}`;
}

function printTable() {
  const getP = (line) => Number(line.split(' • ')[0].slice(1));
  let tempData = [...data.slice(0, -1)];
  tempData = reverse ? tempData.reverse() : tempData;
  const times = tempData.map(d => d.map(dd => (dd.split(' - ').reverse())));
  const priceTo = ([...tempData[0]]).sort((a, b) => getP(a) - getP(b)).map(p => p.split(' - ').reverse());
  const priceFrom = ([...tempData[1]]).sort((a, b) => getP(a) - getP(b)).map(p => p.split(' - ').reverse());
  document.querySelector('.to').innerHTML = priceTo.map((t, i) =>
    `<tr id='${t[0]}'><td>${i + 1}</td><td><a href='${url(t[0])}' target="_blank"> ${t[0]}</a></td><td> ${t[1]}</td></tr>`
  ).join('');
  document.querySelectorAll('tr').forEach(t => t.addEventListener('click', (e) => openReturns(e, times, priceTo, priceFrom)));
}

function openReturns(e, times, priceTo, priceFrom) {
  document.querySelectorAll('.open').forEach(o => o.classList.remove('open'));
  e.target.closest('tr').classList.add('open');
  let day = e.target.closest('tr').id;
  const r = priceTo.findIndex(t => t[0] == day);
  const price = Number(priceTo[r][1].split(' ')[1]);
  const nextMonth = new Date(day);
  nextMonth.setDate(nextMonth.getDate() + (options.stay * (reverse ? -1 : 1)));
  day = (makeDay(nextMonth));
  let d = times[1].findIndex(t => t[0] == day);
  if (d < 0) { d = times[1].length; }
  const days = times[1].filter((t, i) => (i >= d - (reverse ? options.show - 1 : 0)) && (i < d + (reverse ? 1 : options.show)));
  const [cheap1, cheap2, cheap3] = days.map(t => Number(t[1].split(' ')[1]) + price).sort((a, b) => a - b);
  const checkPrice = (currentPrice) => {
    if (currentPrice == cheap1) { return 'cheap1'; }
    if (currentPrice == cheap2) { return 'cheap2'; }
    if (currentPrice == cheap3) { return 'cheap3'; }
    return '';
  };
  const html = days.map(t => `<tr>
          <td>${priceFrom.findIndex(p => p[0] == t[0])}</td>
          <td><a href='${url2(t[0])}' target="_blank">${t[0]}</a></td>
          <td> ${t[1]}</td>
          <td class="${checkPrice(Number(t[1].split(' ')[1]) + price)}">€${Number(t[1].split(' ')[1]) + price}</td>
          </tr>`).join('');
  document.querySelector('.from').innerHTML = (('<tr><td></td></tr>').repeat(reverse ? (r > 2 ? r - 2 : 0) : r)) + html;
}

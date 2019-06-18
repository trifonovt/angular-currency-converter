import { Component, OnInit } from '@angular/core';
import { hardcodedCurrencies } from './currencies.hardoded';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private currencies: object;

  constructor(hasCurrencies) {
    if (!hasCurrencies) {
      this.currencies = hardcodedCurrencies;
    } else {
      this.currencies = hasCurrencies;
    }
  }


  ngOnInit(): void {
    calculatedAmount = document.getElementById('calculated-amount');


  }

  validateInput() {
    const input = document.getElementById('amount');
    if (!input.value) {
      input.style.border = '2px solid red';
      return false;
    } else {
      input.style.border = '1px solid #ced4da';
      return true;
    }
  }

  getFormData() {
    if (this.validateInput() === true) {
      let amount;
      let from;
      let to;
      amount = document.getElementById('amount');

      if (amount) { amount = parseInt(amount.value); }

      from = document.getElementById('from');
      if (from) { from = from.value; }

      to = document.getElementById('to');
      if (to) { to = to.value; }
      return {
        amount,
        from,
        to
      };
    } else {
      return false;
    }
  }

  getCurrencyExchangeRates(event) {
    event.preventDefault();
    if (this.getFormData() !== false) {
      const fD = this.getFormData();
      const xhr = new XMLHttpRequest();
      const apiKey = 'latest?access_key=789b6637e9d33c71debd4b01b758a5e1';
      const queryParams = `&base=${fD.from}&symbols=EUR,JPY,GBP,CHF,USD`;
      const server = `http://data.fixer.io/api/${apiKey + queryParams}`;
      if (fD.from !== 'EUR') {
        this.showConversion();
      } else {
        xhr.open('GET', server, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            const response = JSON.parse(this.response);
            if (response && response.success) {
              this.showConversion(response);
            } else if (response && response.error && response.error.type) {
              console.log(response.error.type);
            }
          }
        };
        xhr.send();
      }
    }
  }

  showConversion(response?) {
    const fD = this.getFormData();
    let calculatedConversion = 0;
    if (fD.from === fD.to) { calculatedConversion = fD.amount; } else
      // Because the currency API is not working for more than EUR currency
      // predefined config object is used to obtain all the cases
      if (response === false) {
        calculatedConversion = fD.amount * this.currencies[fD.from][fD.to];
      } else {
        calculatedConversion = fD.amount * response.rates[fD.to];
      }
    calculatedAmount.innerHTML = `${fD.amount.toFixed(2)} ${fD.from} is ${calculatedConversion.toFixed(2)} ${fD.to}`;
  }

}

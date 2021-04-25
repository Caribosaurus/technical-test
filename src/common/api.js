import axios from 'axios';
import btc_rate from './btc_cad';
import eth_rate from './eth_cad';


function fetchHistory() {
    return axios.get('https://shakepay.github.io/programming-exercise/web/transaction_history.json');
}

function buildBalanceDataSet(transactionHistory){
    let dataSet = {
        data: [],
        label: 'Balance',
        backgroundColor: 'rgba(0, 119, 204, 0.8)',
    };
    let balance = {
        labels: [],
        datasets: [dataSet]
    };

    let currentBalance = new Map();
    currentBalance['BTC'] = 0;
    currentBalance['ETH'] = 0;
    currentBalance['CAD'] = 0;

    transactionHistory.reverse().forEach(operation => {
        operation.createdAt = new Date(operation.createdAt).toISOString().split("T")[0];
        if (operation.type === 'conversion'){
            currentBalance[operation.from.currency] -= operation.from.amount;
            currentBalance[operation.to.currency] += operation.to.amount;
        }
        else {
            currentBalance[operation.currency] += operation.amount * operatorDetection(operation.direction);
        }
        let total = (currentBalance['CAD'] + currentBalance['BTC'] * getRate(btc_rate, operation.createdAt) + currentBalance['ETH'] * getRate(eth_rate, operation.createdAt)).toFixed(2);
        balance.labels.push(operation.createdAt);
        dataSet.data.push(total);
    });

    return balance;

}

function getRate(currency_rate_history, date){
    let rates = {};
    currency_rate_history.forEach(rate => {
        rates[new Date(rate.createdAt).toISOString().split("T")[0]] = rate.midMarketRate;
    });
    if (!rates[date]){
        console.log(`Missing rates for ${date}`);
    }
        
    return rates[date] ? rates[date] : 0;
}


function operatorDetection(direction){
    return direction === 'credit' ? 1 : -1;
}


async function calculateBalanceOvertime(){
    return fetchHistory().then(response => buildBalanceDataSet(response.data));
}

export  {
    calculateBalanceOvertime
};
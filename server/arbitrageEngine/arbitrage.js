import axios from 'axios';
import currencies from './currency';

const makeData = (rates) => {
    let total = 0;
    let dp = [];
    Object.keys(rates).forEach((key1, i) => {
        dp[key1] = [];
        // console.log(`${index}: ${key} : ${rates[key]}`);
        Object.keys(rates).forEach((key2, j) => {
            if(key1 === key2){
                dp[key1][key2] = 0;
            }
            else{
                dp[key1][key2] = (rates[key2]/ rates[key1]);
            }
        })
    })
    //console.log(dp);
    return dp;
}

const floydWarshall = (data, n, parent) => {
    //const n = data.length;
    //console.log('n: ', n);
    for(let k = 0; k < n ; k++){
        for(let i = 0; i < n; i++){
            for(let j = 0; j < n; j++){
                const now = data[i][k] * data[k][j];
                if((Math.round(data[i][j] * 1000) / 1000) < (Math.round(now * 1000) / 1000)){
                    // console.log('here');
                    data[i][j] = now;
                    parent[i][j] = parent[i][k];
                }
            }
        }
    }
    let possible = 0
    for(let i = 0; i < n; i++){
        // console.log(data[i][i]);
        if((Math.round(data[i][i] * 1000) / 1000) > 1.0){
            //console.log(data[i]);
            possible = 1;
        }
    }
    //console.log(data);
    //console.log(parent);
    // for(let i = 0; i < n; i++){
    //     for(let j =0; j < n; j++){
            
    //         if(i != j && (Math.round(data[i][j] * 1000) / 1000) > 1.000 && parent[i][j] != j){
    //         //console.log('parent: ', parent[i][j]);
    //         //const path = findPath(i, j, parent);
    //         const path = [];
    //         console.log(`path between ${i} and ${j} with cost ${data[i][j]}: ${path}`);
    //         }
    //     }
    // }
    return possible;
}

const findPath = (i, j, next) => {
    let path = [i];
    // console.log('next: ', next);
    while(i != j){
        i = next[i][j];
        path.push(i);
    }
    return path;
}

const getData = async () => {
    let dp = [];
    let map = {};

    for(let index = 0; index < currencies.length; index++){
        map[currencies[index]] = index;
    }

    for(let index = 0; index < currencies.length; index++){
        const item = currencies[index];
        const response = await axios.get(`https://api.exchangeratesapi.io/2018-03-26?base=${item}`, {});
        const current = map[item];
        dp[current] = [];
        dp[current][current] = 1.0;
        Object.keys(response.data.rates).forEach((key, i) => {
            if(!map.hasOwnProperty(key)){
                return;
            }
            
            const next = map[key];
            dp[current][next] = response.data.rates[key];
        })
        // console.log(dp[current]);
        // console.log(JSON.stringify(response.data.rates));
    }
    //console.log(dp);

    // for(let i = 0; i < currencies.length; i++){
    //     for(let j = 0; j < currencies.length; j++){
    //         console.log(dp[i][j]);
    //     }
        
    //     // if(dp[i][i] > 1.0){
    //     //     console.log(dp[i]);
    //     // }
    // }

    return dp;

}

const eventHandler = async () => {
    const data = await getData();
    //const response = await axios.get('https://api.exchangeratesapi.io/latest', {});
    //const testData={rates: {USD: 1, GBP: .5, FF: 20}}
    //const data = makeData(testData);
    // const data = makeData(response.data.rates);
    let parent = [];
    for(let i = 0; i < data.length; i++){
        parent[i] = []
        for(let j = 0; j < data.length; j++){
            parent[i][j] = j;
        }
    }
    //console.log(parent);
    const isPossible = floydWarshall(data, data.length, parent);
    console.log(`isPossible: ${isPossible}`);
// //     0 0.5 0 
// 0 0 10 
// 0.21 0 0
    const testData = [[0,0.5,0], [0,0,10], [0.21, 0, 0]];
    // const parent = [[-1,-1,-1], [-1,-1,-1], [-1,-1,-1]];
    
    //floydWarshall(testData, 3, parent);
    return isPossible;
}

export default eventHandler;
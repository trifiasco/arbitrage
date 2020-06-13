import axios from 'axios';

const makeData = (rates) => {
    return rates;
}

const eventHandler = async () => {
    const response = await axios.get('https://api.exchangeratesapi.io/latest', {});
    const data = makeData(response.data.rates);
    return data;
}

export default eventHandler;
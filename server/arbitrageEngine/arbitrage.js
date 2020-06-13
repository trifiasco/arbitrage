import axios from 'axios';

const eventHandler = async () => {
    const response = await axios.get('https://api.exchangeratesapi.io/latest', {});
    return response.data;
}

export default eventHandler;
import { baseUrl } from './constans'
import axios from 'axios'

export const dollar = {
    get: year => axios.get(`${baseUrl}dolar/${year}`)
}
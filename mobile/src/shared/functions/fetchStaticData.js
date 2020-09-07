import Gateway from '../Gateway';
import Guidline from '../../Models/Guideline';

async function fetchStaticData()
{
    const data = await Promise.all([
        fetch(`${Gateway.URL}/ferryguideline?status=A`)
    ])
    return await data.json()
}

const Test = fetchStaticData()

export  default Test;
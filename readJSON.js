import { readFile } from 'fs/promises';
import {db} from './firebaseConfig.js'
import {setDoc, doc} from 'firebase/firestore'

const categories = JSON.parse(await readFile(new URL('./Companies.json', import.meta.url)));

let index = 0;

const addDataToDB = async (data) => {
    await setDoc(doc(db, "companies", data.index.toString()), data);
    console.log("Added Doc: ", data.index)
}

categories.forEach(company => {
    const category = company.link
    const companyDetails = company.data
    companyDetails.forEach(company => {
        const companyName = company["Company Detail"].split('Our Product')[0]
        const companyProduct = company["Company Detail"].split('Our Product')[1].split('Work Type')[0].trim()
        const contactDetails = company["Contact Detail"]
        const companyAddress = company["Address Detail"]
        const owner = contactDetails.split('Person  :')[1] ? contactDetails.split('Person  :')[1].split('Mobile')[0] : null
        const phone = contactDetails.match(/\d{10}/g)
        const email = contactDetails.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig)
        const pin = companyAddress.match(/\d{6}/g)[0]
        const finalData =  {
            index: index++,
            name: companyName,
            owner: owner,
            product: companyProduct,
            phone: phone,
            email: email,
            category: category,
            address: companyAddress,
            city: 'Jaipur',
            pin: pin
        }
        addDataToDB(finalData)
    })
})
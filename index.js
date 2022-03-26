import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import fs from 'fs'

const ROOT = 'https://www.siajaipur.com/'
const INITIAL_ROUTE = 'https://www.siajaipur.com/sia-directory.php'

//Fetch all the links:
fetch(INITIAL_ROUTE)
.then(response => {
    response.text().then(data => {
        parseHTML(data)
    })
})

//Parse HTML Using Cheerio
const parseHTML = (html) => {
    const $ = cheerio.load(html);
    const links = $('a')
    const linkAddresses = [];
    for(let i = 0; i < links.length; i++) {
        linkAddresses.push($(links[i]).attr().href)
    }
    filterLinks(linkAddresses, 'advertise.php')
}

//Filter links that start with a particular prefix
const filterLinks = (links, prefix) => {
    const filteredLinks = links.filter((link) => link.startsWith(prefix))
    crawlLinks(filteredLinks)
}

//Crawl each link to look for table
const crawlLinks = async (links) => {
    for(let i = 0; i < links.length; i++) {
        const link = links[i]
        console.log(`Crawling ${link}`)
        const response = await fetch(`${ROOT}${link.trim()}`)
        const html = await response.text()
        getDetailsFromTable(html,link)
    }
}

const getDetailsFromTable = (html,link) => {
    const $ = cheerio.load(html)
    const rows = $('tr')

    //GET HEADERS
    const headers = $('th',$(rows[0]))
    const headerTitles = []
    for(let i = 0; i < headers.length; i++) {
        headerTitles.push($(headers[i]).text())
    }

    //CREATE JSON OBJECT FOR ALL ENTRIES
    const companiesDetails = []
    for(let i = 1; i < rows.length; i++) {
        const columns = $('td', rows[i])
        if(columns.length !== 0){
            const companyDetails = {}
            for(let i = 1; i < columns.length; i++) {
                companyDetails[headerTitles[i]] = $(columns[i]).text().trim().replace(/\n/gm, '')
            }
            companiesDetails.push(companyDetails)
        }
    }

    console.log(companiesDetails.length)
    writeArrayToJSONFile(companiesDetails, link.split('cname=')[1])
}

const writeArrayToJSONFile = (array, linkName) => {
    const jsonData = {
        link: linkName,
        data: array
    }
    
    fs.readFile('companies.json', function (err, data) {
        //If file doesnt exist create one
        const JSONString = JSON.stringify([jsonData]).replace(/\n/gm, '')
        if(err) {
            fs.appendFile('companies.json', JSONString, (error) => {
                if(error) return error
                console.log("Record added successfully")
            })
        } else {
            //If file exists append data
            var json = JSON.parse(data);
            json.push(jsonData);    
            fs.writeFile("companies.json", JSON.stringify(json), function(err){
                if (err) throw err;
                console.log("Record added successfully")
            });
        }
    })
}
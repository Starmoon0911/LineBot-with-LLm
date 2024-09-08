const { default: axios } = require("axios")

const getweather = async () => {
    const url = 'https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-C0032-026?Authorization=rdec-key-123-45678-011121314&format=JSON'
    const respones = await axios({
        method:'get',
        url:url,
    })
    console.log(respones.data.cwaopendata.dataset)
    return respones.data
}

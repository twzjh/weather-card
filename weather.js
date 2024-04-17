let btnAll = document.querySelectorAll('.nav-btn');
let cities = [
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市','高雄市', '屏東縣','宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'],
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣'],
    ['臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣'],
    ['臺南市', '高雄市', '屏東縣'],
    ['宜蘭縣', '花蓮縣', '臺東縣'],
    ['澎湖縣', '金門縣', '連江縣'],
];

let nowCities = cities[0];
let orgData = {};

let url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-2716C38E-8C28-4687-8A3B-B9A4CB944A3B'

//主程式
fetch_data();

btnAll.forEach((btn,index) => {
    btn.addEventListener('click', () => {
        nowCities = cities[index];
        fetch_data();
    });
});

function fetch_data() {
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (datas) {
        console.log(datas);
        // 1.組織資料
        orientationData(datas);
        // 2.處理城市
        arrangeCites();
    });
}

function orientationData(data){
    let locationAll = data.records.location
    console.log(locationAll);
    locationAll.forEach(location => {
        let locationName = location.locationName;
        let loc_wE_t0 = location.weatherElement[0].time[0];
        let wxCondition = loc_wE_t0.parameter.parameterName;
        let startTime = loc_wE_t0.startTime;
        let endTime = loc_wE_t0.endTime;
        let minT = location.weatherElement[2].time[0].parameter.parameterName;
        let maxT = location.weatherElement[4].time[0].parameter.parameterName;
        let pop = location.weatherElement[1].time[0].parameter.parameterName;
        let ci = location.weatherElement[3].time[0].parameter.parameterName;

        orgData[locationName] = {
            'wxCondition': wxCondition,
            'startTime': startTime,
            'endTime': endTime,
            'maxT': maxT,
            'minT': minT,
            'pop': pop,
            'ci': ci,
        }
        console.log(orgData);
    });
}

function arrangeCites(){
    let cardRegion = document.querySelector('.card-region');
    cardRegion.innerHTML = '';
    nowCities.forEach((city, index) =>{
        let cityData = orgData[city];
        console.log(city, cityData);
        cardRegion.innerHTML += `
        <div class="card">
            <div class="city" style="font-size:30px;font-weight:bold;">${city} </div><p>

            <span class="time">${cityData.startTime}</span><br>
            <span class="time">至</span><br>
            <span class="time">${cityData.endTime}</span><br>

            <div class="temper">
                <span class="material-symbols-outlined">thermostat</span>
                <span class="minTemp">${cityData.minT}°C</span>
                <span>/</span>
                <span class="maxTemp">${cityData.maxT}°C</span>  
            </div>

            <span class="ci">${cityData.ci}</span><br>

            <div class="wxCondition" style="font-weight:bold;">${cityData.wxCondition}</div><p>

            <img style="height:80px;weight:80px;"src='./svg/${cityData.wxCondition}.svg'alt="">

            <div class="pop">
                <span class="pop"><span class="material-symbols-outlined">
                rainy</span>
                <span>${cityData.pop}%</span><br>
            </div>
        </div>`
    })
}
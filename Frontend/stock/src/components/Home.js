import { useEffect, useState } from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import axios from 'axios';
import CanvasJSReact from './canvasjs.react';


export default function Home() {

    var options;
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;

    const [ticker, setTicker] = useState('');
    const [period, setPeriod] = useState('');
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    const [graph, setGraph] = useState([]);
    const [isGraph, setIsGraph] = useState(false);


    options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2",
        exportFileName: ticker,
        title:{
            text: ticker
        },
        axisX: {
            interval:1,
            intervalType: "day",
            valueFormatString: "DDD"
        },
        axisY: {
            includeZero:false,
            prefix: "",
            title: "Price"
        },
        data: [{
            type: "ohlc",
            yValueFormatString: "Rs###0.00",
            xValueFormatString: "MMM YYYY",
            dataPoints: graph
        }]
    }
    
    function getData() {

        const val = {
            "ticker": ticker, 
            "period": period
        }

        axios
        .post('http://127.0.0.1:8000/fetch-data/', val)
        .then(response => {
            if(response.data === "failure") {
                alert('Invalid Ticker Code Entered');
                return;
            }
                var array = response.data;

                var dict = [];
                var temp = [];
                var temp_var;
                var temp_num;
                var min = 999999;
                var max = 0;
                var data_avg = 0;

                for(let i=0; i<array.length; i++) {
                    temp = [];    
                    temp_var = new Date(array[i][0]);
                    for(let j=1; j<5; j++) {
                        temp_num = parseFloat(array[i][j]) 
                        temp.push(temp_num);  
                        if(temp_num < min) {
                            min = temp_num;
                        }

                        if(temp_num > max) {
                            max = temp_num;
                        }

                    }
                    dict.push(
                        {
                            x: temp_var,
                            y: temp
                        }
                    );
                }

                setGraph(dict);
                setMax(max);
                setMin(min);
                setIsGraph(true);
        })
        .catch()
    }

    return (
        <Router>

            <div>
                <div className="home-container">
                    
                <div className="home-card">

                    <div className="home-inner">
                        <input type="text" id="home-ip" 
                            value = {ticker}
                            onChange = {e => {setTicker(e.target.value)}}
                        />
                        <button id="home-btn" onClick={() => getData()}>Search</button>
                    </div>

                    <div className="home-inner-left">
                        <div id="home-left-card">
                            <button id="inner-card-btn">Line</button>
                            <button id="inner-card-btn">CandleStick</button>
                            <button id="inner-card-btn">Vertex Line</button>
                            <button id="inner-card-btn">Coloured Bar</button>

                            <div id="home-dates">
                                <button id="inner-card-btn1">1D</button>
                                <button id="inner-card-btn1">1W</button>
                                <button id="inner-card-btn1">1M</button>
                            </div>

                            <div id="home-lower-comp">
                                <div><b>Min</b> <br/><br/> {min}</div>
                                <div><b>Max</b> <br/><br/> {max}</div>
                            </div>
                        </div>

                        <div id="home-right-card">
                        {isGraph ?
                            <CanvasJSChart options = {options} /> 
                            :
                            <></>
                        }
                        </div>
                    </div>

                </div>
                
                </div>
            </div>

        </Router>

        // <div>
        //     <button onClick={() => {getData()}}>Request</button>
        
        //     <div>   
        //         {val.map((target, index) => {
        //             return ( 
        //                 <div>
        //                     {target.map((subTarget, subIndex) => {
        //                         return (
        //                             <>
        //                                 {subIndex == 0 ?
        //                                     <br/>
        //                                     :
        //                                     <></>
        //                                 }
                                        
        //                                 <ul>{subTarget}</ul>
        //                             </>
        //                         );
        //                     }
        //                     )}
        //                 </div>
        //             );
        //         }
        //         )}
        //     </div>
        // </div> 
    );
}




from django.shortcuts import render

# rest_framework
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

import json
import requests


class HomeView(APIView):

    def post(self, request):

        if request.method == 'POST':
            # ticker = request.POST['ticker']
            ticker = 'AAPL'
            ticker_cap = ticker.upper()
            try:
                api = requests.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ ticker +'&apikey=37VZLYPP251TU9OD')

                if(api.status_code==200):
                    json_val = json.loads(api.text)
                    json_next = json_val.get('Time Series (Daily)')

                    date = []
                    for i in json_next:
                        date.append(i)

                    open_v = []
                    high = []
                    low = []
                    close_v = []
                    for j in date[:16]:
                        value = json_next.get(j)
                        open_v.append(value.get('1. open'))
                        high.append(value.get('2. high'))
                        low.append(value.get('3. low'))
                        close_v.append(value.get('4. close'))

                    all_data = zip(date, open_v, high, low, close_v)
                    return Response(all_data) 
            except Exception as e:
                print(e)        
                return Response('error retriving data') 
        else:
            return Response('failure') 


class FetchStockData(APIView):

    def post(self, request):

        data = request.data

        ticker = data.get('ticker')

        period = data.get('period')
        
        if ticker is not None:

            try:

                ticker_cap = ticker.upper()
            
            except:

                ticker_cap = ticker

            try:
                api = requests.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ ticker_cap +'&apikey=37VZLYPP251TU9OD')

                if(api.status_code==200):
                    json_val = json.loads(api.text)
                    json_next = json_val.get('Time Series (Daily)')

                    date = []
                    for i in json_next:
                        date.append(i)

                    open_v = []
                    high = []
                    low = []
                    close_v = []
                    for j in date[:16]:
                        value = json_next.get(j)
                        open_v.append(value.get('1. open'))
                        high.append(value.get('2. high'))
                        low.append(value.get('3. low'))
                        close_v.append(value.get('4. close'))

                    all_data = zip(date, open_v, high, low, close_v)
                    return Response(all_data) 

            except Exception as e:
                print(e)        
                return Response('failure') 

            return Response('success')

        else:

            return Response('NOTICKER')
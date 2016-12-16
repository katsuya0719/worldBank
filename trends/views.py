from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.template import RequestContext
import json as simplejson
import trends.connect as connect
import logging


# Create your views here.
def index(request):
    print(request)
    template=loader.get_template('index.html')
    context = RequestContext(request)
    print(context)
    return HttpResponse(template.render(context))

countries_mapping = {"India":"IND", "Pakistan":"PAK", "USA":"US", "Italy":"IT","Switzerland":"CH", "Japan":"JP" , "China":"CN", "UK":"GBR"}
indicators_mapping = {
    "Total":"1.1_TOTAL.FINAL.ENERGY.CONSUM",
    "Solar" : "2.1.6_SHARE.SOLAR",
    "Biomass" :  "2.1.1_SHARE.TRADBIO",
    "Wind" :  "2.1.5_SHARE.WIND",
    "Waste" :  "2.1.8_SHARE.WASTE",
    "Geo" :  "2.1.7_SHARE.GEOTHERMAL",
    "Hydro":"2.1.3_SHARE.HYDRO",
    "Renewable":"2.1_SHARE.TOTAL.RE.IN.TFEC"
  }

metric_full_name_mapping = {
    "Total":"Total",
    "Solar" : "Solar",
    "Biomass" :  "Traditional Biomass",
    "Wind" :  "Wind",
    "Waste" :  "Waste",
    "Geo" :  "Geo Thermal",
    "Hydro":"Hydroelectric",
    "Renewable":"Renewable"
  }

def fetch_and_draw_data(request):
    print(request)
    #connect.initialize()
    country = request.GET.get('country', 'USA')
    metric = request.GET.get('metric', 'Total')

    country_code = countries_mapping[country]
    indicator_code = indicators_mapping[metric]
    data_url = get_url(country_code, indicator_code)
    print("data_url is"+str(data_url))
    json_from_cache = connect.get_json_data(data_url)
    print("json_from_cache"+str(json_from_cache))
    metric_full_name = metric_full_name_mapping[metric]
    graphTitle = "%s Energy Consumption Data in %s" % (metric_full_name, country)
    xAxisTitle = "Testing"
    yAxisTitle = json_from_cache[1][0]["indicator"]["value"]
    xAxisLabels = []
    yAxisValues = []

    for item in reversed(json_from_cache[1]):
        xAxisLabels.append(item["date"])
        yAxisValues.append(float(item["value"]))

    data_list = {"graphTitle": graphTitle, "xAxisLabels": xAxisLabels,
                 "xAxisTitle": xAxisTitle, "yAxisTitle": yAxisTitle, "yAxisValues": yAxisValues}
    return HttpResponse(simplejson.dumps(data_list))

def get_url(country_code, indicators):
    return ("http://api.worldbank.org/countries/%s/indicators/%s?per_page=10&date=2000:2010&format=json" % (
        country_code, indicators));
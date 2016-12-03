from django.shortcuts import render

# Create your views here.
def fetch_and_draw_data(request):
    connect.initialize()
    country = request.GET.get('country', 'USA')
    metric = request.GET.get('metric', 'Total')

    country_code = countries_mapping[country]
    indicator_code = indicators_mapping[metric]
    data_url = get_url(country_code, indicator_code)
    json_from_cache = connect.get_json_data(data_url)

    // create a data list
    data_list = {"graphTitle": graphTitle, "xAxisLabels": xAxisLabels,
                 "xAxisTitle": xAxisTitle, "yAxisTitle": yAxisTitle, "yAxisValues": yAxisValues}
    return HttpResponse(simplejson.dumps(data_list))

def get_url():
    def get_url(country_code, indicators):
        return ("http://api.worldbank.org/countries/%s/indicators/%s?per_page=10&date=2000:2010&format=json" % (
        country_code, indicators));
var mapChart = dc.geoChoroplethChart("#map"),
    provinceChart = dc.rowChart("#provinces"),
    partnersChart = dc.rowChart("#partners"),
    sectorChart = dc.barChart("#sector"),
    statusChart = dc.pieChart("#status");

function loadData(err, geodata, data) {

    var cf = crossfilter(data.results);


    // {
    //
    //     "project": "Verification mission on Administration Agreement DCI-ASIE/2008/147-718 concerning the Multi-Donor Trust Fund for Trade Development Facility (TF No.070918)",
    //     "province": "Vientiane Capital",
    //     "partner": "European Union",
    //     "province_amount": 19220.0,
    //     "status": "Ongoing",
    //     "sector": "Private sector development "
    //
    // }

    var province = cf.dimension(function (d) {
        return d['province'];
    }, true);

    var sector = cf.dimension(function (d) {
        return d['sector'];
    });

    var partner = cf.dimension(function (d) {
        return d["partner"];
    });

    var status = cf.dimension(function (d) {
        return d['status'];
    });

    var funding_by_status = status.group()
        .reduceCount(function (d) {
            return d["province_amount"];
        });

    var funding_by_partner = partner.group()
        // reduceSum
        .reduceCount(function (d) {
            return d["province_amount"];
        });

    var funding_by_province = province.group()
        .reduceCount(function (d) {
            return d["province_amount"];
        });

    var count_by_sector = sector.group()
        .reduceCount(function (d) {
            return d['sector']
        });

    var provincetList = province.group().all().map(function (d) {
        return d.key
    });

//            var oblastList = oblast.group().all().map(function (d) {
//                return d.key
//            });
//     console.log(funding_by_province);
//     console.log(centroid);

    var projection = d3.geo.mercator().center([110, 18]).scale(2500);

    mapChart
        .width(500)
        .height(500)
        .dimension(province)
        .group(funding_by_province)
        //                .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
        .overlayGeoJson(
            geodata.features
            , "state"
            , function (d) {
                return d.properties['pr_name2'];
            }
        )
        .title(function (p) {
            return p.key
                + '\n'
                + 'Index Gain: ' + p.value + '\n'
            // + 'Index Gain in Percentage: ' + numberFormat(p.value.percentageGain) + '%\n';
        })
        .projection(projection);


    provinceChart
        .width(500)
        .height(750)
        .margins({top: 10, right: 40, bottom: 35, left: 40})
        .dimension(province)
        .group(province.group())
        .ordering(function (d) {
            return -d.value;
        })
        .transitionDuration(500)
        // .centerBar(false)
        .gap(10) // 65 = norm
        .colors("#026CB6")
        // .x(d3.scale.ordinal().domain(provincetList))
        // .xUnits(dc.units.ordinal)
        .elasticX(true)
        // .xAxisLabel('Provinces')
        // .yAxisLabel('# of ??? by province')

        .on('filtered', function (chart, filter) {

        })
        .xAxis()
        .ticks(5);
    // .tickFormat();


    partnersChart
        .width(500)
        .height(750)
        .margins({top: 10, right: 40, bottom: 35, left: 40})
        .dimension(partner)
        .group(funding_by_partner)
        .ordering(function (d) {
            return -d.value;
        })
        .transitionDuration(500)
        .gap(10) // 65 = norm
        .colors("#026CB6")
        .x(d3.scale.ordinal().domain(provincetList))
        .elasticX(true)
        .on('filtered', function (chart, filter) {

        })
        .xAxis()
        .ticks(5);

    sectorChart.width(1200)
        .height(350)
        .margins({top: 10, right: 50, bottom: 35, left: 40})
        .dimension(sector)
        .group(count_by_sector)
        .transitionDuration(500)
        .centerBar(false)
        .gap(15) // 65 = norm
        .colors("#026CB6")
        .x(d3.scale.ordinal().domain(sector.group().all().map(function (d) {
            return d.key
        })))
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel('Sectors')
        .yAxisLabel('# of ??? by sector')
        .on('filtered', function (chart, filter) {

        })
        .xAxis().tickFormat();


    statusChart
        .width(560)
        .height(560)
        .slicesCap(4)
        .innerRadius(100)
        .dimension(status)
        .group(funding_by_status)
        .legend(dc.legend())
        // workaround for #703: not enough data is accessible through .label() to display percentages
        .on('pretransition', function (chart) {
            chart.selectAll('text.pie-slice').text(function (d) {
                return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
            })
        });

    var all = cf.groupAll();

    dc.dataCount("#count")
        .dimension(cf)
        .group(all);


    dc.renderAll();


    // fix interactions between map and oblast charts

    var all = dc.chartRegistry.list();

    mapChart.onClick = function (datum, layerIndex) {
        var selectedRegion = mapChart.geoJsons()[layerIndex].keyAccessor(datum);
        provinceChart.filter(selectedRegion);
        mapChart.redrawGroup()
    };

    mapChart.hasFilter = function (filter) {
        var filters = provinceChart.filters();
        if (!filter) {
            return filters.length > 0
        }
        return filters.indexOf(filter) != -1
    }


}
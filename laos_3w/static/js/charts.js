var mapChart = dc.geoChoroplethChart("#map"),
    provinceChart = dc.barChart("#provinces"),
    sectorChart = dc.barChart("#sector");

function loadData(err, geodata, data) {

    var cf = crossfilter(data);

    var province = cf.dimension(function (d) {
        return d['PName'];
    });

    var sector = cf.dimension(function (d) {
        return d['Sector'];
    });

    var funding_by_province = province.group()
        .reduceSum(function (d) {
            return d["Planed_amo"];
        });

    var count_by_sector = sector.group()
        .reduceCount(function (d) {
            return d['Sector']
        });

    var provincetList = province.group().all().map(function (d) {
        return d.key
    });

//            var oblastList = oblast.group().all().map(function (d) {
//                return d.key
//            });

    console.log(funding_by_province);
    console.log(province.group().all());

    var projection = d3.geo.mercator().center([103.75, 18.85]).scale(2500);

    mapChart
        .width(1000)
        .height(500)
        .dimension(province)
        .group(funding_by_province)
        //                .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
        .overlayGeoJson(
            geodata.features
            , "state"
            , function (d) {
                return d.properties['P_Eng'];
            }
        )
        .projection(projection);


    provinceChart.width(1200)
        .height(350)
        .margins({top: 10, right: 40, bottom: 35, left: 40})
        .dimension(province)
        .group(funding_by_province)
        .transitionDuration(500)
        .centerBar(false)
        .gap(15) // 65 = norm
        .colors("#026CB6")
        .x(d3.scale.ordinal().domain(provincetList))
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel('Provinces')
        .yAxisLabel('# of ??? by province')

        .on('filtered', function (chart, filter) {

        })
        .xAxis().tickFormat();


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


    var all = cf.groupAll();

    dc.dataCount("#count")
        .dimension(cf)
        .group(all);


    dc.renderAll();

}
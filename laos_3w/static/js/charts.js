var mapChart = dc.geoChoroplethChart("#map"),
    provinceChart = dc.rowChart("#provinces"),
    partnersChart = dc.rowChart("#partners"),
    sectorChart = dc.barChart("#sector"),
    statusChart = dc.pieChart("#status");

function loadData(err, geodata, data, districts) {

    $('#loader').toggleClass('active');

    var cf = crossfilter(data.results);

    var province = cf.dimension(function (d) {
        return d['province'];
    }, true);

    var district = cf.dimension(function (d) {
        return d['district'];
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

    var count_by_status = status.group()
        .reduceCount(function (d) {
            return d["status"];
        });

    var funding_by_status = status.group()
        .reduceSum(function (d) {
            return d["planed_amount"];
        });

    var partner_group = partner.group()
        .reduceCount(function (d) {
            return d["partner"];
        });

    var count_by_partner = partner.group()
        .reduceCount(function (d) {
            return d["partner"];
        });

    var funding_by_partner = partner.group()
        .reduceSum(function (d) {
            return d["planed_amount"];
        });


    var count_by_province = province.group()
        .reduceCount(function (d) {
            return d["project_title"];
        });

    var count_by_district = district.group()
        .reduceCount(function (d) {
            return d["project_title"];
        });

    var funding_by_province = province.group()
        .reduceSum(function (d) {
            return d["planed_amount"] / d.province.length;
        });

    var count_by_sector = sector.group()
        .reduceCount(function (d) {
            return d['sector']
        });

    var funding_by_sector = sector.group()
        .reduceSum(function (d) {
            return d['planed_amount']
        });

    var provincetList = province.group().all().map(function (d) {
        return d.key
    });

//            var oblastList = oblast.group().all().map(function (d) {
//                return d.key
//            });
//     console.log(funding_by_province);
//     console.log(centroid);

    var projection = d3.geo.mercator().center([106, 19]).scale(3600);
    var colorscale = d3.scale.threshold()
        .domain([1, 3, 6, 9, 12, 15])
        .range(['#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#034e7b']);

    var colorscale2 = d3.scale.threshold()
        .domain([1000000, 3000000, 5000000, 8000000, 10000000, 50000000])
        .range(['#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#034e7b']);

    //
    mapChart
        .width(700)
        .height(650)
        .dimension(province)
        .group(count_by_province)
        // funding_by_province
        .colors(colorscale)
        // d3.scale.quantize().range(['#fff7fb','#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#034e7b']))
        // ["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]
        .overlayGeoJson(
            // districts.features
            geodata.features
            , "state"
            , function (d) {
                return d.properties['pr_name2'];
                // return d.properties['DName'];

            }
        )
        .title(function (p) {
            return p.key + ': ' + p.value
                + '\n'
                + 'Funding: ' + p.value
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
        // .xAxisLabel('Provinces')
        .gap(10)
        .colors("#026CB6")
        .elasticX(true)
        .on('filtered', function (chart, filter) {
        })
        .xAxis()
        .ticks(5);


    // 65 = norm
    // .centerBar(false)
    // .xAxisLabel('Provinces')
    // .yAxisLabel('# of ??? by province')
    // .x(d3.scale.ordinal().domain(provincetList))
    // .xUnits(dc.units.ordinal)
    // .tickFormat();


    partnersChart
        .width(350)
        .height(180)
        .margins({top: 10, right: 40, bottom: 35, left: 40})
        .dimension(partner)
        .group(partner.group())
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
        .margins({top: 10, right: 50, bottom: 35, left: 60})
        .dimension(sector)
        .group(count_by_sector)
        .transitionDuration(500)
        .centerBar(false)
        .gap(65)
        .colors("#026CB6")
        .x(d3.scale.ordinal().domain(sector.group().all().map(function (d) {
            return d.key
        })))
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel('Sectors')
        .yAxisLabel('Interventions by Sector')
        .on('filtered', function (chart, filter) {

        })
        .xAxis().tickFormat();


    statusChart
        .width(600)
        .height(600)
        .slicesCap(4)
        .innerRadius(100)
        .externalLabels(30)
        .externalRadiusPadding(50)
        .drawPaths(true)
        .dimension(status)
        .group(count_by_status)
        .legend(dc.legend())
        // workaround for #703: not enough data is accessible through .label() to display percentages
        .on('pretransition', function (chart) {
            chart.selectAll('text.pie-slice').text(function (d) {
                return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
            })
        });

    // statusChart.on('pretransition', function (chart) {
    //     chart.selectAll('.dc-legend-item text')
    //         .text('')
    //         .append('tspan')
    //         .text(function (d) {
    //             return d.name;
    //         })
    //         .append('tspan')
    //         .attr('x', 100)
    //         .attr('text-anchor', 'end')
    //         .text(function (d) {
    //             return d.data;
    //         });
    // });

    var all = cf.groupAll();

    dc.dataCount("#count")
        .dimension(cf)
        .group(all);


    var total_funding = cf.groupAll().reduceSum(function (d) {
        return d["planed_amount"];
    });

    dc.numberDisplay("#funding-total")
        .valueAccessor(function (d) {
            return d;
        })
        .group(total_funding);

    dc.renderAll();


    // $('#geolevel').on('change', function (e) {
    //     console.log($(this).val())
    // })
    var svg = d3.select("#legend");

    svg.append("g")
        .attr("class", "legendQuant")
        .attr("transform", "translate(20,20)");

    var legend = d3.legend.color()
        .labelFormat(d3.format(",.0f"))
        .scale(colorscale);

    svg.select(".legendQuant")
        .call(legend);


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
    };

    $("#projects").on('click', function (e) {
        mapChart.group(count_by_province).colors(colorscale);
        legend.scale(colorscale);
        svg.select(".legendQuant")
            .call(legend);

        provinceChart.group(count_by_province);
        partnersChart.group(count_by_partner);

        // partner.group()
        //     .reduceCount(function (d) {
        //         return d["project_title"];
        //     });

        sectorChart.group(count_by_sector);
        statusChart.group(count_by_status);
        dc.renderAll();
    });

    $("#funding").on('click', function (e) {
        mapChart
            .group(funding_by_province)
            .colors(colorscale2);
        legend.scale(colorscale2);
        svg.select(".legendQuant")
            .call(legend);

        provinceChart.group(funding_by_province);
        partnersChart.group(funding_by_partner);

        // partner.group()
        //     .reduceSum(function (d) {
        //         return d["planed_amount"];
        //     });

        sectorChart.group(funding_by_sector);
        statusChart.group(funding_by_status);
        dc.renderAll();
    });


    $('#geolevel').on('change', function (e) {

        var geolevel = $(this).val();

        if (geolevel == 'province') {
            mapChart.overlayGeoJson(
                geodata.features
                , "state"
                , function (d) {
                    return d.properties['pr_name2'];
                }
            )
                .dimension(province)
                .group(count_by_province);

            dc.renderAll();
        } else {
            mapChart.overlayGeoJson(
                districts.features
                , "state"
                , function (d) {
                    return d.properties['DName'];
                }
            )
                .dimension(district)
                .group(count_by_district);

            dc.renderAll();
        }
    });


    function downloadData() {

        var header = [
            'project_title',
            'status',
            'sector',
            'partner',
            'planed_amount',
            'province',
            'province_l',
            'district'
        ];

        var data = partner.top(Infinity)
            .map(function (record) {
                return header.map(function (field) {
                    return (record[field] instanceof Array ? record[field].join(';') : record[field])

                })
            });


        data.unshift(header);
        var result = d3.csv.formatRows(data);
        var blob = new Blob([result], {type: "text/csv;charset=utf-8"});
        saveAs(blob, 'jp-projects-laos-dataset-' + (new Date()).getTime() + '.csv')

    }

    $('#download').on('click', function (e) {
        downloadData();
    });

}
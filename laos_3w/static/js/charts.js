var mapChart = dc.geoChoroplethChart("#map"),
    mapDistrictChart = dc.geoChoroplethChart("#map-district"),
    provinceChart = dc.rowChart("#provinces"),
    impPartnersChart = dc.rowChart("#implementing_partners"),
    partnersChart = dc.rowChart("#partners"),
    sectorChart = dc.barChart("#sector"),
    subsectorChart = dc.rowChart("#subsector"),
    statusChart = dc.rowChart("#status");

function loadData(err, geodata, data, districts) {


    var config = {
        level: 'province',
        measure: 'count'
    };


    var districtsDict = {
        'Bualapha District': 'Khammouan'
    };


    $('#loader').toggleClass('active');

    var cf = crossfilter(data.results);

    var province = cf.dimension(function (d) {
        return d['province'];
    }, true);

    var district = cf.dimension(function (d) {
        return d['district'] ? d['district'] : 'No district';
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

    var implementing_partner = cf.dimension(function (d) {
        return d['implementing_partner'] ? d['implementing_partner'] : 'No implementing partner';
    });

    var other_subsector = cf.dimension(function (d) {
        return d['other_subsector'] ? d['other_subsector'] : 'No subsector';
    });

    // Groups for Dimensions


    var count_by_province = province.group()
        .reduceCount(function (d) {
            return d["project_title"];
        });

    var funding_by_province = province.group()
        .reduceSum(function (d) {
            return Math.round(d["planed_amount"] / d.province.length);
        });

    var count_by_district = district.group()
        .reduceCount(function (d) {
            return d["project_title"];
        });

    var funding_by_district = district.group()
        .reduceSum(function (d) {
            return Math.round(d["planed_amount"] / d.district.length);
        });

    var count_by_sector = sector.group()
        .reduceCount(function (d) {
            return d['sector']
        });

    var funding_by_sector = sector.group()
        .reduceSum(function (d) {
            return Math.round(d['planed_amount']);
        });

    var count_by_other_subsector = other_subsector.group()
        .reduceCount(function (d) {
            return d["other_subsector"];
        });

    var funding_by_other_subsector = other_subsector.group()
        .reduceSum(function (d) {
            return Math.round(d['planed_amount']);
        });
    var count_by_implementing_partner = implementing_partner.group()
        .reduceCount(function (d) {
            return d["implementing_partner"];
        });

    var funding_by_implementing_partner = implementing_partner.group()
        .reduceSum(function (d) {
            return Math.round(d['planed_amount']);
        });


    var count_by_status = status.group()
        .reduceCount(function (d) {
            return d["status"];
        });

    var funding_by_status = status.group()
        .reduceSum(function (d) {
            return Math.round(d['planed_amount']);
        });

    var count_by_partner = partner.group()
        .reduceCount(function (d) {
            return d["partner"];
        });

    var funding_by_partner = partner.group()
        .reduceSum(function (d) {
            return Math.round(d['planed_amount']);
        });

    function reduceAdd(p, v) {
        ++p.count;
        p.total += d3.format('.0f')(v["planed_amount"] / p.count);
        return p;
    }

    function reduceRemove(p, v) {
        --p.count;
        p.total -= v["planed_amount"] / p.count;
        return p;
    }

    function reduceInitial() {
        return {
            count: 0,
            total: 0
        };
    }

    var by_province = province.group()
        .reduce(reduceAdd, reduceRemove, reduceInitial);


    var projection = d3.geo.mercator().center([108, 19]).scale(3100);

    function returnScale(group) {

        var breaks = [0].concat(group.all().map(function (d) {
            return d.value;
        }));

        var colors = ['#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#034e7b'];
        // https://github.com/schnerd/d3-scale-cluster

        var scale = d3.scaleCluster()
            .domain(breaks)
            .range(colors);

        var clusters = scale.clusters();


        if (clusters.length < colors.length) {

            var ranges = clusters.length > 1 ? clusters.length + 1 : 3;
            // if (clusters.length > 1) {
            colors = colors.slice(0, ranges);
            // }

            //    colors.length - clusters.length - 1


        }
        console.log(colors)
        return d3.scaleCluster()
            .domain(breaks)
            .range(colors)

    }

    mapDistrictChart
        .width(500)
        .height(600)
        .dimension(district)
        .group(count_by_district)
        .colors(returnScale(count_by_district))
        .overlayGeoJson(
            districts.features
            , "state"
            , function (d) {
                return d.properties['DName'];
            }
        )
        .title(function (p) {
            return p.key + ': ' + p.value
            // + '\n'
            // + 'Funding: ' + p.value;
            // d3.format('.3s')()
            // + 'Index Gain in Percentage: ' + numberFormat(p.value.percentageGain) + '%\n';
        })
        .projection(projection);


    mapChart
        .width(500)
        .height(600)
        .dimension(province)
        .group(count_by_province)

        // funding_by_province
        .colors(returnScale(count_by_province))
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
        // .valueAccessor(function (d) {
        //     return d.value.count;
        // })
        .title(function (p) {
            return p.key + ': ' + p.value
            // + '\n'
            // + 'Funding: ' + p.value;
            // + 'Index Gain in Percentage: ' + numberFormat(p.value.percentageGain) + '%\n';
        })
        .on('filtered', function (chart, filter) {

        })
        .projection(projection);


    // mapChart.on('renderlet', function (chart) {
    //     console.log($('#geolevel').val())
    //     mapChart.colors(returnScale(count_by_province))
    // })

    provinceChart
        .width(400)
        .height(650)
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

            chart.filters();
            // if ($('#geolevel').val() === 'district') {
            //     console.log(filter);
            //     mapChart.filter(['Bualapha District'])
            // }
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

    impPartnersChart
        .width(500)
        .height(750)
        .margins({top: 10, right: 40, bottom: 35, left: 40})
        .dimension(implementing_partner)
        .group(count_by_implementing_partner)
        .data(function (group) {
            // console.log(group.top(25))

            return group.top(25).filter(function (d) {
                return d.key !== 'No implementing partner'
            });
            // return group.top(25);
        })
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
        .x(d3.scale.ordinal())
        .elasticX(true)
        .on('filtered', function (chart, filter) {

        })
        .xAxis()
        .ticks(5);

    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                tspans = text.selectAll('tspan'),
                words = [];

            if (tspans[0].length > 0) {
                tss = [];
                tspans[0].map(function (d) {
                    tss = tss.concat(d3.select(d).text().split(/\s+/));
                }).reverse();

                words = tss.reverse();
            } else {
                words = text.text().split(/\s+/).reverse();
            }


            var word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");


            while (word = words.pop()) {
                line.push(word);


                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    // console.log(line)
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(line.join(" "));
                }
            }
        });
    }

    sectorChart.width(700)
        .height(350)
        .margins({top: 10, right: 50, bottom: 60, left: 60})
        .dimension(sector)
        .group(count_by_sector)
        .ordering(function (d) {
            return d.key === 'Other' ? 999 : 1;
        })
        .transitionDuration(500)
        .centerBar(false)
        .gap(10)
        .colors("#026CB6")
        // .x(d3.scale.ordinal().domain(sector.group().all().map(function (d) {
        //     return d.key
        // })))
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        // .xAxisLabel('Sectors')
        .yAxisLabel('Number of Projects')
        .on('filtered', function (chart, filter) {

        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxis()
        .tickFormat();

    sectorChart.on('renderlet', function (chart) {
        chart.selectAll(".x text")
            .call(wrap, 60);
    });


    subsectorChart
    // .width(1200)
    // .height(350)
        .width(350)
        .height(350)
        .margins({top: 10, right: 40, bottom: 35, left: 40})
        // .margins({top: 10, right: 50, bottom: 35, left: 60})
        .dimension(other_subsector)
        .group(other_subsector.group())
        .data(function (group) {
            // console.log(group.top(25))

            return group.top(25).filter(function (d) {
                return d.key !== 'No subsector'
            });
            // return group.top(25);
        })
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
        .ticks(5)
        .tickFormat(d3.format('.0f'));


    // .data(function (group) {
    //     return group.top(5);
    // //
    // //     var result = group.all()
    // //
    // //
    // //     console.log(group.top(12));
    // //     console.log(group.all());
    // //     console.log(group.all().filter(function(d) {
    // //         return d.key !== null
    // //     }));
    // //
    // //     return group.all().filter(function(d) {
    // //         return d.key !== 'No subsector'
    // //     });
    // })
    // .ordering(function (d) {
    //     return -d.value;
    // })
    // .transitionDuration(500)
    // .centerBar(false)
    // .gap(45)
    // .colors("#026CB6")
    // .x(d3.scale.ordinal().domain(other_subsector.group().all().map(function (d) {
    //     return d.key
    // })))
    // .xUnits(dc.units.ordinal)
    // .elasticY(true)
    // .xAxisLabel('Sectors')
    // .yAxisLabel('Number of Projects')
    // .on('filtered', function (chart, filter) {
    //
    // })
    // // .filter(function(d) { console.log(d.key); return d.key !== null; })
    // .xAxis().tickFormat();


    statusChart
        .width(350)
        .height(180)
        .margins({top: 10, right: 40, bottom: 35, left: 40})
        .dimension(status)
        .group(count_by_status)
        .ordering(function (d) {
            return -d.value;
        })
        .transitionDuration(500)
        .gap(10) // 65 = norm
        .colors("#026CB6")
        .x(d3.scale.ordinal())
        .elasticX(true)
        .on('filtered', function (chart, filter) {

        })
        .xAxis()
        .ticks(5);

    // .width(600)
    // .height(600)
    // .slicesCap(4)
    // .innerRadius(100)
    // .externalLabels(30)
    // .externalRadiusPadding(50)
    // .drawPaths(true)
    // .dimension(status)
    // .group(count_by_status)
    // .legend(dc.legend())
    // // workaround for #703: not enough data is accessible through .label() to display percentages
    // .on('pretransition', function (chart) {
    //     chart.selectAll('text.pie-slice').text(function (d) {
    //         return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
    //     })
    // });

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
            return Math.round(d);
        })
        .group(total_funding);
    // .formatNumber(d3.format(",.0f"));

    dc.renderAll();


    // Initialize legend container with .legendQuant class
    var svg = d3.select("#legend");
    svg.append("g")
        .attr("class", "legendQuant")
        .attr("transform", "translate(20,20)");


    function updateLegend(scale, format) {

        // Aplly colorscale and number format to the legend

        var legend = d3.legend.color()
            .scale(scale)
            .labelFormat(format);

        svg.select(".legendQuant")
            .call(legend);

        function clearLabel(labels) {
            labels.each(function () {
                var label = d3.select(this);
                label.text(label.text().replace('to NaN', 'and more'));
            });
        }

        svg.selectAll("text.label")
            .call(clearLabel)
    }


    updateLegend(returnScale(count_by_province), d3.format(".0f"));


    // fix interactions between map and oblast charts
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

    // mapDistrictChart.hasFilter = function (filter) {
    //     var groups = {
    //
    //         'district': {
    //             'count': count_by_district,
    //             'funding': funding_by_district
    //         }
    //     };
    //     var current_group = groups['district'][config.measure]
    //     mapDistrictChart.colors(returnScale(current_group))
    //     updateLegend(returnScale(current_group), d3.format(".0f"))
    //
    // };

    cf.onChange(function (e) {

        var groups = {
            'province': {
                'count': count_by_province,
                'funding': funding_by_province
            },
            'district': {
                'count': count_by_district,
                'funding': funding_by_district
            }
        };

        var current_group = groups['province'][config.measure];

        mapChart.colors(returnScale(current_group));

        // mapDistrictChart.colors(returnScale(current_group));

        // if (config.level === 'province') {
        //
        // }
        updateLegend(returnScale(current_group), d3.format(".0f"))
    });


    function changeChoropleth(chart, group, colors, type) {

        var format = {
            c: ".0f",
            f: ",.3s"
        };

        chart
            .group(group)
            // .valueAccessor(group)
            .colors(colors);

        // format[type]

    }

    function projects(d) {
        return d.value.count;
    }

    function funding(d) {
        return d.value.total;
    }

    $("#projects").on('click', function (e) {

        var geolevel = config.level;
        config.measure = 'count';
        changeChoropleth(mapChart, count_by_province, returnScale(count_by_province), 'c');
        changeChoropleth(mapDistrictChart, count_by_district, returnScale(count_by_district), 'c');
        updateLegend(returnScale(geolevel === 'province' ? count_by_province : count_by_district), d3.format(".0f"));
        provinceChart.group(count_by_province);
        partnersChart.group(count_by_partner);
        subsectorChart.group(count_by_other_subsector);
        impPartnersChart.group(count_by_implementing_partner);
        sectorChart.group(count_by_sector);
        statusChart.group(count_by_status);
        dc.renderAll();
    });

    $("#funding").on('click', function (e) {

        var geolevel = config.level;
        config.measure = 'funding';
        changeChoropleth(mapChart, funding_by_province, returnScale(funding_by_province), 'f');
        changeChoropleth(mapDistrictChart, funding_by_district, returnScale(funding_by_district), 'f');
        updateLegend(returnScale(geolevel === 'province' ? funding_by_province : funding_by_district), d3.format(".0f"));
        provinceChart.group(funding_by_province);
        partnersChart.group(funding_by_partner);
        subsectorChart.group(funding_by_other_subsector);
        impPartnersChart.group(funding_by_implementing_partner);
        sectorChart.group(funding_by_sector);
        statusChart.group(funding_by_status);
        dc.renderAll();
    });

    function show(container, chart) {
        document.getElementById('map').style.display = 'none';
        document.getElementById('map-district').style.display = 'none';
        document.getElementById(container).style.display = 'block';

        updateLegend(chart.colors(), d3.format(".0f"));
        chart.render();
    }

    $('#geolevel').on('change', function (e) {

        console.log(config);

        var geolevel = $(this).val();

        config.level = geolevel;

        console.log(config);

        if (geolevel == 'province') {
            show('map', mapChart);
        } else {
            show('map-district', mapDistrictChart);
        }

        $('#geolabel').html(geolevel);
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
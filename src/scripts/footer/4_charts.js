function createCharts() {
    const averageBillData = []
    let lastBill = endData && endData.bill ? parseInt(endData.bill) : 165
    const intervals = 10
    const yearsPerInterval = 2.5
    const pointsPerInterval = 5
    const totalPoints = intervals *
        pointsPerInterval
    const annualIncreaseRate = 0.037

    for (let point = 0; point <= totalPoints; point++) {
        const year = (point / pointsPerInterval) * yearsPerInterval
        if (point % pointsPerInterval === 0) {
            lastBill *= Math.pow(1 + annualIncreaseRate,
                yearsPerInterval)
        }
        const fluctuation = (Math.random() - 0.5) * 10;
        averageBillData.push({
            x: year,
            y: Math.max(150, lastBill + fluctuation)
        });
    }
    const solarBillRate = 165
    const solarBillData = Array.from({
        length: totalPoints + 1
    }, (_, i) => ({
        x: (i / pointsPerInterval) * yearsPerInterval,
        y: solarBillRate
    }));
    const totalDuration = 5000;
    const delayBetweenPoints = totalDuration / averageBillData.length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y
    const animation = {
        x: {
            type: 'number',
            easing: 'easeInOutBounce',
            duration: delayBetweenPoints,
            from: NaN,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0
                }
                ctx.xStarted = true
                return ctx.index * delayBetweenPoints
            }
        },
        y: {
            type: 'number',
            easing: 'easeInOutBounce',
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0
                }
                ctx.yStarted = true
                return ctx.index * delayBetweenPoints
            }
        }
    }

    const options = {
        type: 'line',
        options: {
            responsive: true,
            animation,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Years Passed'
                    },
                    ticks: {
                        callback: function (value) {
                            if (value % 2 === 0)
                                return value;
                        },
                        stepSize: 2
                    }
                },
                y: {
                    min: 50,
                    max: 400,
                    stepSize: 50,
                    title: {
                        display: true,
                        text: 'Bill Amount ($)'
                    }
                }
            },
            plugins: {
                deferred: {
                    xOffset: 100,
                    yOffset: '50%',
                    delay: 0
                },
                tooltip: {
                    usePointStyle: true,
                    callbacks: {
                        title: function (context) {
                            const startDate = new Date()
                            const monthsToAdd = parseFloat(context[0].label) * 12
                            startDate.setMonth(startDate.getMonth() + monthsToAdd)

                            const month = startDate.toLocaleString('default', {
                                month: 'long'
                            })
                            const yearForX = startDate.getFullYear()
                            const dateString = `${month} ${yearForX}`

                            return dateString
                        },
                        label: function (context) {
                            return `$${context.parsed.y.toFixed(2)}`;
                        },
                        labelPointStyle: function (context) {
                            return {
                                pointStyle: false
                            }
                        }
                    }
                },
                legend: {
                    display: false,
                    usePointStyle: true,
                    pointStyle: 'line',
                }
            }
        }
    }
    const averageBillChart = new Chart(document.getElementById(
        'averageBillChart').getContext('2d'), {
        ...options,
        plugins: [ChartDeferred],
        data: {
            datasets: [{
                data: averageBillData,
                borderColor: '#E04D41',
                fill: false,
                pointStyle: false,
                tension: 0.4,
            }]
        }
    })

    const solarBillChart = new Chart(document.getElementById(
        'solarBillChart').getContext('2d'), {
        ...options,
        plugins: [ChartDeferred],
        data: {
            datasets: [{
                data: solarBillData,
                borderColor: '#00BA81',
                fill: false,
                pointStyle: false
            }]
        }
    });
    const combinedChart = new Chart(document.getElementById('combinedBillChart').getContext('2d'), {
        ...options,
        plugins: [ChartDeferred],
        data: {
            datasets: [{
                    label: 'Without Solar',
                    data: averageBillData,
                    borderColor: '#E04D41',
                    fill: false,
                    pointStyle: false,
                    tension: 0.4
                },
                {
                    label: 'With Solar',
                    data: solarBillData,
                    borderColor: '#00BA81',
                    fill: false,
                    pointStyle: false
                }
            ]
        }

    })
}

function onIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // createCharts()
            observer.unobserve(entry.target)
        }
    })
}

let observer = new IntersectionObserver(onIntersection, {
    threshold: 0.5
})

document.addEventListener("DOMContentLoaded", () => {
    const factsElement = document.getElementById(
        'charts');
    if (factsElement) {
        console.log(
            "#charts element found. Starting to observe."
        )
        observer.observe(factsElement);
        // createCharts()
    } else {
        console.error(
            'Element with ID #charts not found.');
    }
})
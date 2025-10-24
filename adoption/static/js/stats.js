const g1 = document.getElementById("posts-per-day-graph").getContext("2d"); 
const g2 = document.getElementById("posts-per-type-graph").getContext("2d"); 
const g3 = document.getElementById("posts-per-month-graph").getContext("2d"); 

async function get_stats() {
    try {
        const response = await fetch('/api/stats');
        if (response.ok) {
            const data = await response.json(); 
            
            plot_posts_per_day(data['data']['byDate']);
            plot_posts_per_type(data['data']['byType']);
            plot_posts_per_month_and_type(data['data']['byMonthAndType'])
            
            
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        document.getElementById("error-msg").innerText = "No se pudieron cargar las estadísticas.";
        console.error('Error:', error); 
    }
}

const plot_posts_per_day = (data_by_day) => {
    new Chart(g1, {
        type: "line",
        data: {
            labels: data_by_day.map(n => n.date),
            datasets: [{
                label: "Cantidad de avisos",
                fill: false,
                borderColor: "blue",
                data: data_by_day.map(n => n.count),
                tension: 0
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: "Cantidad de avisos de adopción por día"
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Cantidad de avisos"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Día"
                    }
                }
            }
        }
    });
}

const plot_posts_per_type = (data_by_type) => {
    new Chart(g2, {
        type: "pie",
        data: {
            labels: data_by_type.map(n => n.type.charAt(0).toUpperCase() + n.type.slice(1)),
            datasets: [{
                data: data_by_type.map(n => n.count),
                backgroundColor: ["orange", "blue"]
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: "Avisos de adopción por tipo de mascota"
                },
                legend: {
                    display: true,
                    position: "top"
                }
            }
        }
    });
}

const plot_posts_per_month_and_type = (data_by_month_and_type) => {
    const months = Object.keys(data_by_month_and_type);

    const dog_posts_count = new Array(months.length).fill(0);
    const cat_posts_count = new Array(months.length).fill(0);

    months.forEach((month, i) => {
        data_by_month_and_type[month].forEach(counter => {
            if (counter.type === 'gato') {
                cat_posts_count[i] = counter.count;
            } else if (counter.type === 'perro') {
                dog_posts_count[i] = counter.count;
            }
        });
    });

    new Chart(g3, {
        type: "bar",
        data: {
            labels: months,
            datasets: [
                {
                    label: "Perro",
                    data: dog_posts_count,
                    backgroundColor: "orange"
                },
                {
                    label: "Gato",
                    data: cat_posts_count,
                    backgroundColor: "blue"
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            plugins: { 
                title: {
                    display: true,
                    text: "Avisos de adopción por mes y tipo de mascota"
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Cantidad de avisos"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Año-Mes"
                    }
                }
            }
        }
    });    
}

window.onload = get_stats;
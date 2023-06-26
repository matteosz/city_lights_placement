// Create the grid data
const gridData = [];
const gridSize = 100;
for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
        gridData.push({ x: x, y: y });
    }
}

// Set up the plot container
const container = d3.select('#plot-container')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${gridSize*9} ${gridSize*9}`);

// Add the city map image
container.append('image')
    .attr('xlink:href', 'map.svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('x', 0)
    .attr('y', 0);

// Set up the grid
const grid = container.selectAll('rect')
    .data(gridData)
    .enter()
    .append('rect')
    .attr('x', (d) => d.x * 9)
    .attr('y', (d) => d.y * 9)
    .attr('width', '10')
    .attr('height', '10')
    .attr('fill', '#000')
    .attr('stroke', '#fff')
    .attr('stroke-width', '1px')
    .attr('opacity', 1);

// Set up the lights
const lights = [];
const addLightButton = document.querySelector('#add-light');
const co2CounterSpan = document.querySelector('#co2-counter');
const treeCounterSpan = document.querySelector('#tree-counter');
const lightIntegralSpan = document.querySelector('#light-integral');

addLightButton.addEventListener('click', () => {
    // Add the light to the lights array
    const intensity = 5;
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);

    const index = lights.length;
    lights.push({ x: x, y: y, intensity: intensity });

    // Update the CO2 counter
    co2CounterSpan.textContent = calculateCO2(lights).toFixed(2);

    // Update the tree counter
    treeCounterSpan.textContent = (Math.round(parseInt(co2CounterSpan.textContent) / 24));

    // Update the light integral
    lightIntegralSpan.textContent = calculateLightIntegral(lights).toFixed(2);

    // Update the grid
    updateGrid();

    // Add an emitter card to the emitters container
    const emitterCard = document.createElement('div');
    emitterCard.classList.add('emitter-card');
    emitterCard.innerHTML = `
        <div class="row">
        <div class="col-10">
            <h3>Emitter ${index+1}</h3>
            <p>Location (dm):</p>
            <label for="x-coordinate-${index}">X:</label>
            <input type="number" id="x-coordinate-${index}" value="${x}" min="0" max="${gridSize}">
            <label for="y-coordinate-${index}">Y:</label>
            <input type="number" id="y-coordinate-${index}" value="${y}" min="0" max="${gridSize}">
            <p>Intensity (KLm):</p>
            <input type="number" id="intensity-${index}" value="${intensity}" min="0" max="30">
        </div>
        <div class="col-2">
            <button class="btn btn-danger delete-emitter-btn" data-index="${index}">
            <i class="fas fa-trash"></i>
            </button>
        </div>
        </div>
        `;
    document.querySelector('#emitters-container').appendChild(emitterCard);

    // Add event listeners to the emitter card inputs
    const xInput = document.querySelector(`#x-coordinate-${index}`);
    const yInput = document.querySelector(`#y-coordinate-${index}`);
    const intensityInput = document.querySelector(`#intensity-${index}`);
    xInput.addEventListener('change', () => {
        lights[index].x = parseInt(xInput.value);
        updateGrid();
    });
    yInput.addEventListener('change', () => {
        lights[index].y = parseInt(yInput.value);
        updateGrid();
    });
    intensityInput.addEventListener('change', () => {
        lights[index].intensity = parseInt(intensityInput.value);
        updateGrid();
        lightIntegralSpan.textContent = calculateLightIntegral(lights).toFixed(2);
        co2CounterSpan.textContent = calculateCO2(lights).toFixed(2);
        treeCounterSpan.textContent = (Math.round(parseInt(co2CounterSpan.textContent) / 24));
    });

    // Add event listener to the delete button
    const deleteBtn = emitterCard.querySelector('.delete-emitter-btn');
    deleteBtn.addEventListener('click', () => {
        // Remove the emitter from the lights array
        const index = parseInt(deleteBtn.dataset.index);
        lights.splice(index, 1);

        // Update the CO2 counter
        co2CounterSpan.textContent = calculateCO2(lights).toFixed(2);

        // Update the tree counter
        treeCounterSpan.textContent = (Math.round(parseInt(co2CounterSpan.textContent) / 24));

        // Update the light integral
        lightIntegralSpan.textContent = calculateLightIntegral(lights).toFixed(2);

        // Update the grid
        updateGrid();

        // For each emitter card with index greater than index in the emitters-container, update HTML and event listeners
        const emittersContainer = document.querySelector('#emitters-container');
        
        // Remove the emitter card from the emitters container
        emittersContainer.removeChild(emitterCard);

        const emitterCards = emittersContainer.querySelectorAll('.emitter-card');
        emitterCards.forEach((card, idx) => {
            if (idx < index) {
                return;
            }

            // Update the index of the emitter card title
            const title = card.querySelector('h3');
            title.textContent = `Emitter ${idx+1}`;

            // Update the index of the emitter card inputs
            const xInput = card.querySelector(`#x-coordinate-${idx+1}`);
            const yInput = card.querySelector(`#y-coordinate-${idx+1}`);
            const intensityInput = card.querySelector(`#intensity-${idx+1}`);
            xInput.id = `x-coordinate-${idx}`;
            yInput.id = `y-coordinate-${idx}`;
            intensityInput.id = `intensity-${idx}`;

            var oldX = xInput;
            var newX = oldX.cloneNode(true);
            oldX.parentNode.replaceChild(newX, oldX);

            var oldY = yInput;
            var newY = oldY.cloneNode(true);
            oldY.parentNode.replaceChild(newY, oldY);

            var oldIntensity = intensityInput;
            var newIntensity = oldIntensity.cloneNode(true);
            oldIntensity.parentNode.replaceChild(newIntensity, oldIntensity);

            // Re add the emitter listeners
            newX.addEventListener('change', () => {
                lights[idx].x = parseInt(newX.value);
                updateGrid();
            });
            newY.addEventListener('change', () => {
                lights[idx].y = parseInt(newY.value);
                updateGrid();
            });
            newIntensity.addEventListener('change', () => {
                lights[idx].intensity = parseInt(newIntensity.value);
                updateGrid();
                lightIntegralSpan.textContent = calculateLightIntegral(lights).toFixed(2);
                co2CounterSpan.textContent = calculateCO2(lights).toFixed(2);
                treeCounterSpan.textContent = (Math.round(parseInt(co2CounterSpan.textContent) / 24));
            });

            // Update the index of the emitter card delete button
            const deleteBtn = card.querySelector('.delete-emitter-btn');
            deleteBtn.dataset.index = idx;
        });
    });
});

function updateGrid() {
    grid.attr('opacity', (d) => {
        const lightValue = calculateLightValue(d.x, d.y, lights);
        return 1 - lightValue / 1000;
    });
}

function calculateCO2(lights) {
    let counter = 0;
    lights.forEach((light) => {
        counter += light.intensity;
    });
    return counter;
}

function calculateLightIntegral(lights) {
    let integral = 0;
    gridData.forEach((d) => {
        integral += calculateLightValue(d.x, d.y, lights);
    });
    return integral / 1000000;
}

function calculateLightValue(x, y, lights) {
    // Calculate the light value at a specific point on the grid
    let lightValue = 0;
    lights.forEach((light) => {
        const dx = x - light.x;
        const dy = y - light.y;
        const distance2 = dx * dx + dy * dy; // in Dmeters^2
        if (distance2 === 0) {
            lightValue += light.intensity * 1000;
        } else {
            lightValue += light.intensity * 1000 / distance2; // Lumens / Dmeters^2
        }
    });
    return lightValue;
}